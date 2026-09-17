import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NewsArticle } from '../../../core/models';
import { NewsService } from '../../../core/services/news.service';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';
import { NotificationService } from '../../../core/services/notification.service';
import { extractErrorMessage } from '../../../core/utils/extract-error-message';
import { ButtonComponent, IconComponent, PageHeaderComponent } from '../../../shared/ui';
import { NewsTableComponent } from './components/news-table/news-table.component';
import { NewsFormModalComponent } from './components/news-form-modal/news-form-modal.component';
import { NewsImageModalComponent } from './components/news-image-modal/news-image-modal.component';

type StatusFilter = 'all' | 'active' | 'inactive';

/**
 * "Sistema → Noticias" — contenido editorial de la landing pública, NO un
 * producto: título, imagen, descripción, fecha de publicación, orden,
 * activo/inactivo. Admin-only end to end (todo `NewsController` lo es en
 * el backend, incluido el listado, porque expone noticias inactivas).
 */
@Component({
  selector: 'app-news-page',
  standalone: true,
  imports: [
    FormsModule,
    PageHeaderComponent,
    ButtonComponent,
    IconComponent,
    NewsTableComponent,
    NewsFormModalComponent,
    NewsImageModalComponent,
  ],
  templateUrl: './news-page.component.html',
  styleUrl: './news-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsPageComponent {
  private readonly newsService = inject(NewsService);
  private readonly confirmDialogService = inject(ConfirmDialogService);
  private readonly notificationService = inject(NotificationService);

  readonly articles = signal<NewsArticle[]>([]);
  readonly loading = signal(true);

  readonly searchTerm = signal('');
  readonly statusFilter = signal<StatusFilter>('all');

  readonly isFormOpen = signal(false);
  readonly editingArticle = signal<NewsArticle | null>(null);

  readonly imageArticle = signal<NewsArticle | null>(null);

  readonly filteredArticles = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const status = this.statusFilter();

    return this.articles().filter((article) => {
      const matchesTerm = !term || article.title.toLowerCase().includes(term);
      const matchesStatus =
        status === 'all' || (status === 'active' && article.isActive) || (status === 'inactive' && !article.isActive);
      return matchesTerm && matchesStatus;
    });
  });

  readonly hasActiveFilters = computed(() => this.searchTerm().trim().length > 0 || this.statusFilter() !== 'all');

  readonly statusOptions: { value: StatusFilter; label: string }[] = [
    { value: 'all', label: 'Todas' },
    { value: 'active', label: 'Activas' },
    { value: 'inactive', label: 'Inactivas' },
  ];

  constructor() {
    this.fetchArticles();
  }

  fetchArticles(): void {
    this.loading.set(true);
    this.newsService.getArticles(true).subscribe({
      next: (articles) => {
        this.articles.set(articles);
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);
        this.notificationService.error(extractErrorMessage(error, 'No se pudieron cargar las noticias.'));
      },
    });
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.statusFilter.set('all');
  }

  openCreateForm(): void {
    this.editingArticle.set(null);
    this.isFormOpen.set(true);
  }

  openEditForm(article: NewsArticle): void {
    this.editingArticle.set(article);
    this.isFormOpen.set(true);
  }

  closeForm(): void {
    this.isFormOpen.set(false);
  }

  onArticleSaved(article: NewsArticle): void {
    const wasEditing = this.editingArticle() !== null;
    this.isFormOpen.set(false);

    this.articles.update((list) => (wasEditing ? list.map((a) => (a.id === article.id ? article : a)) : [article, ...list]));

    this.notificationService.success(
      wasEditing ? `"${article.title}" se actualizó correctamente.` : `"${article.title}" se publicó correctamente.`,
    );

    if (!wasEditing) {
      // A una noticia recién creada le falta la imagen — se abre directo el gestor.
      this.imageArticle.set(article);
    }
  }

  openImage(article: NewsArticle): void {
    this.imageArticle.set(article);
  }

  closeImage(): void {
    this.imageArticle.set(null);
  }

  onImageChanged(article: NewsArticle): void {
    this.imageArticle.set(article);
    this.articles.update((list) => list.map((a) => (a.id === article.id ? article : a)));
  }

  async toggleActive(article: NewsArticle): Promise<void> {
    const activating = !article.isActive;
    const confirmed = await this.confirmDialogService.confirm({
      type: activating ? 'UPDATE' : 'DELETE',
      title: activating ? 'Activar noticia' : 'Desactivar noticia',
      message: activating
        ? `¿Desea activar "${article.title}"?`
        : `¿Desea desactivar "${article.title}"? Se ocultará de la landing pública, pero se conservará el histórico.`,
    });
    if (!confirmed) {
      return;
    }

    const request$ = activating ? this.newsService.activateArticle(article.id) : this.newsService.deactivateArticle(article.id);
    request$.subscribe({
      next: () => {
        this.articles.update((list) => list.map((a) => (a.id === article.id ? { ...a, isActive: activating } : a)));
        this.notificationService.success(activating ? 'Noticia activada correctamente.' : 'Noticia desactivada correctamente.');
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.error(extractErrorMessage(error, 'No se pudo actualizar el estado de la noticia.'));
      },
    });
  }

  moveUp(article: NewsArticle): void {
    const list = this.articles();
    const index = list.findIndex((a) => a.id === article.id);
    if (index <= 0) {
      return;
    }
    this.swapOrder(list, index, index - 1);
  }

  moveDown(article: NewsArticle): void {
    const list = this.articles();
    const index = list.findIndex((a) => a.id === article.id);
    if (index === -1 || index >= list.length - 1) {
      return;
    }
    this.swapOrder(list, index, index + 1);
  }

  private swapOrder(list: NewsArticle[], indexA: number, indexB: number): void {
    const reordered = [...list];
    [reordered[indexA], reordered[indexB]] = [reordered[indexB], reordered[indexA]];

    const items = reordered.map((article, index) => ({ id: article.id, sortOrder: index }));
    this.newsService.reorderArticles(items).subscribe({
      next: () => {
        this.articles.set(reordered.map((article, index) => ({ ...article, sortOrder: index })));
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.error(extractErrorMessage(error, 'No se pudo cambiar el orden.'));
      },
    });
  }
}
