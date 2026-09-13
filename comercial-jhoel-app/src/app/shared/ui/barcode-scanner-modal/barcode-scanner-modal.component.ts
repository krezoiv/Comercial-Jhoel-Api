import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { BarcodeFormat, DecodeHintType } from '@zxing/library';
import { NotificationService } from '../../../core/services/notification.service';
import { ButtonComponent } from '../button/button.component';

const DEFAULT_FORMATS: BarcodeFormat[] = [
  BarcodeFormat.EAN_13,
  BarcodeFormat.EAN_8,
  BarcodeFormat.UPC_A,
  BarcodeFormat.UPC_E,
  BarcodeFormat.CODE_128,
];

const CAMERA_UNAVAILABLE_MESSAGE = 'No se pudo acceder a la cámara. Puedes ingresar el código manualmente.';

interface ScannerControls {
  stop(): void;
}

/**
 * Modal de escaneo de código de barras vía cámara — el único lugar de toda
 * la app que toca `getUserMedia`/`MediaStream`. No conoce productos,
 * inventario, precios ni ningún concepto de negocio: solo pide la cámara,
 * decodifica un código y lo emite como texto. Cualquier pantalla que hoy
 * acepta un código tecleado puede abrir este modal y tratar el resultado
 * exactamente como si el usuario lo hubiera escrito a mano.
 */
@Component({
  selector: 'app-barcode-scanner-modal',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './barcode-scanner-modal.component.html',
  styleUrl: './barcode-scanner-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarcodeScannerModalComponent implements OnChanges, AfterViewChecked, OnDestroy {
  @Input() open = false;
  @Input() formats: BarcodeFormat[] = DEFAULT_FORMATS;

  @Output() scanned = new EventEmitter<string>();
  @Output() closed = new EventEmitter<void>();

  @ViewChild('videoElement') private readonly videoElementRef?: ElementRef<HTMLVideoElement>;

  private readonly notificationService = inject(NotificationService);

  private reader: BrowserMultiFormatReader | null = null;
  private controls: ScannerControls | null = null;
  private activeStream: MediaStream | null = null;
  private handled = false;
  private cameraStarted = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open'] && !this.open) {
      this.stopScanning();
      this.cameraStarted = false;
    }
  }

  // El <video> solo existe en el DOM cuando `open` es true (@if en el
  // template) — se espera a que la vista ya lo haya renderizado antes de
  // pedir la cámara, en vez de asumir que está listo en el mismo tick que
  // `ngOnChanges`.
  ngAfterViewChecked(): void {
    if (this.open && !this.cameraStarted && this.videoElementRef) {
      this.cameraStarted = true;
      this.handled = false;
      void this.startScanning();
    }
  }

  ngOnDestroy(): void {
    this.stopScanning();
  }

  cancel(): void {
    this.stopScanning();
    this.cameraStarted = false;
    this.closed.emit();
  }

  private async startScanning(): Promise<void> {
    const video = this.videoElementRef?.nativeElement;
    if (!video) {
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      this.failWith(CAMERA_UNAVAILABLE_MESSAGE);
      return;
    }

    const hints = new Map<DecodeHintType, unknown>();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, this.formats);
    this.reader = new BrowserMultiFormatReader(hints);

    try {
      this.controls = await this.reader.decodeFromConstraints(
        { video: { facingMode: { ideal: 'environment' } } },
        video,
        (result) => {
          if (this.handled || !result) {
            return;
          }
          this.handled = true;
          const code = result.getText();
          this.stopScanning();
          this.cameraStarted = false;
          this.scanned.emit(code);
        },
      );
      this.activeStream = (video.srcObject as MediaStream | null) ?? null;
    } catch (error) {
      this.handleStartError(error);
    }
  }

  private handleStartError(error: unknown): void {
    const name = (error as { name?: string } | null)?.name;
    if (name === 'NotAllowedError' || name === 'SecurityError' || name === 'PermissionDeniedError') {
      this.failWith(CAMERA_UNAVAILABLE_MESSAGE);
      return;
    }
    if (name === 'NotFoundError' || name === 'OverconstrainedError' || name === 'DevicesNotFoundError') {
      this.failWith('No se encontró ninguna cámara compatible. Puedes ingresar el código manualmente.');
      return;
    }
    if (name === 'NotReadableError' || name === 'TrackStartError') {
      this.failWith('La cámara está siendo usada por otra aplicación. Puedes ingresar el código manualmente.');
      return;
    }
    this.failWith(CAMERA_UNAVAILABLE_MESSAGE);
  }

  private failWith(message: string): void {
    this.notificationService.error(message);
    this.stopScanning();
    this.cameraStarted = false;
    this.closed.emit();
  }

  private stopScanning(): void {
    try {
      this.controls?.stop();
    } catch {
      // El control ya pudo haber sido detenido por la propia librería.
    }
    this.controls = null;

    if (this.activeStream) {
      this.activeStream.getTracks().forEach((track) => track.stop());
      this.activeStream = null;
    }

    this.reader = null;
  }
}
