import {waitForTimeout} from '@alwatr/wait';
import {html, nothing, type PropertyValues, type TemplateResult} from 'lit';
import { customElement, property } from 'lit/decorators.js';


import {snackbarActionButtonClickedSignal} from './signal.js';
import {BaseElement, waitForNextFrame} from './utils.js';

declare global {
  interface HTMLElementTagNameMap {
    'snack-bar': SnackbarComponent;
  }
}

@customElement('snack-bar')
export class SnackbarComponent extends BaseElement {
  @property({type: String}) content = '';
  @property({type: String, attribute: 'action-button-label'}) actionButtonLabel: string | null = null;
  @property({type: Boolean, attribute: 'add-close-button'}) addCloseButton = false;

  /**
   * For the open and close animation to wait for animation end.
   */
  private static openAndCloseAnimationDuration__ = 200; // ms

  protected override firstUpdated(changedProperties: PropertyValues): void {
    super.firstUpdated(changedProperties);

    // wait for render complete, then open the snackbar to start the opening animation
    waitForNextFrame().then(() => {
      this.setAttribute('open', '');
    });
  }

  /**
   * Close element and remove it from the DOM.
   *
   * Wait for the closing animation to end before removing the element.
   */
  async close(): Promise<void> {
    this.logger_.logMethod?.('close');

    this.removeAttribute('open');

    await waitForTimeout(SnackbarComponent.openAndCloseAnimationDuration__);
    this.remove();
  }

  /**
   * Send signal when action button is clicked.
   */
  private actionButtonClickHandler__(): void {
    this.logger_.logMethod?.('actionButtonClickHandler__');

    snackbarActionButtonClickedSignal.notify();
  }

  protected override render(): unknown {
    super.render();

    const actionButtonHtml = this.renderActionButton__();
    const closeButtonHtml = this.renderCloseButton__();

    let actionButtonHandler: TemplateResult | typeof nothing = nothing;
    if (actionButtonHtml != nothing || closeButtonHtml != nothing) {
      actionButtonHandler = html`<div>${actionButtonHtml} ${closeButtonHtml}</div>`;
    }

    return [html`<span>${this.content}</span>`, actionButtonHandler];
  }

  private renderActionButton__(): TemplateResult | typeof nothing {
    if (this.actionButtonLabel == null) return nothing;
    this.logger_.logMethodArgs?.('renderActionButton__', {actionLabel: this.actionButtonLabel});

    return html` <button class="action-button" @click=${this.actionButtonClickHandler__.bind(this)}>${this.actionButtonLabel}</button> `;
  }

  private renderCloseButton__(): TemplateResult | typeof nothing {
    if (this.addCloseButton === false) return nothing;
    this.logger_.logMethod?.('renderCloseButton__');

    return html`
      <button class="close-button" @click=${this.close.bind(this)}>
        <span class="icon">close</span>
      </button>
    `;
  }
}
