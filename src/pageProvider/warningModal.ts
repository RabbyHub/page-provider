import IconRabby from '../assets/rabby.svg';
import IconDanger from '../assets/danger.svg';

interface Props {
  origin: string;
  onClose: () => void;
  onContinue: () => void;
}

const STYLE_PREFIX = 'rabby-phishing-modal';

const style = `
.${STYLE_PREFIX} {
  background: #EC5151;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999999;
  display: flex;
  padding: 20px;
  font-family: 'Roboto', sans-serif;
}

.${STYLE_PREFIX}-logo {
  width: 100px;
  display: block;
  margin: 0 auto 16px;
}

.${STYLE_PREFIX}-content {
  background: #fff;
  border-radius: 8px;
  padding: 20px 40px;
  margin: auto;
  display: flex;
  flex-direction: column;
  max-width: 800px;
}

.${STYLE_PREFIX}-title {
  font-weight: 700;
  font-size: 20px;
  line-height: 23px;
  color: #EC5151;
  margin: 0 0 0 12px;
}

.${STYLE_PREFIX}-headline {
  display: flex;
  margin: 0 auto 16px;
}

.${STYLE_PREFIX}-text {
  font-size: 15px;
  color: #13141A;
  line-height: 22px;
  margin: 0 0 22px 0;
  font-weight: 400;
}

.${STYLE_PREFIX}-body {
  margin-bottom: 28px;
}

.${STYLE_PREFIX}-footer {
  display: flex;
  margin: auto;
  flex-direction: column;
  align-items: center;
}

.${STYLE_PREFIX}-close {
  display: block;
  background: #EC5151;
  border-radius: 4px;
  outline: none;
  width: 212px;
  height: 48px;
  border: none;
  color: #fff;
  font-size: 15px;
  margin-bottom: 20px;
}

.${STYLE_PREFIX}-close:hover {
  opacity: 0.8;
}

.${STYLE_PREFIX}-continue {
  font-size: 12px;
  color: #707280;
  text-decoration: underline;
}

.${STYLE_PREFIX}-continue:hover {
  opacity: 0.8;
}
`;

export class WarningModal {
  el: HTMLDivElement | null;
  closeButton: HTMLDivElement | null;
  continueButton: HTMLDivElement | null;
  props: Props;

  constructor(props: Props) {
    this.el = null;
    this.closeButton = null;
    this.continueButton = null;
    this.props = props;
  }

  show() {
    this.el = document.createElement('div');
    this.el.className = STYLE_PREFIX;
    this.insert();
  }

  hide() {
    if (!this.el) {
      return;
    }
    this.el.remove();
    this.el = null;
  }

  private insert() {
    if (!this.el) {
      return;
    }

    const elMain = document.createElement('div');
    elMain.className = `${STYLE_PREFIX}-content`;

    elMain.innerHTML = `
      <img class="${STYLE_PREFIX}-logo" src="${IconRabby}" />
      <div class="${STYLE_PREFIX}-headline">
        <img class="${STYLE_PREFIX}-danger" src="${IconDanger}" />
        <h1 class="${STYLE_PREFIX}-title">Phishing site detected by Rabby</h1>
      </div>
      <div class="${STYLE_PREFIX}-body">
        <p class="${STYLE_PREFIX}-text">
        Rabby detects that you are currently visiting a phishing site. Interaction on the website might lead to losses. Therefore Rabby has restricted access to the site.
        </p>
        <p class="${STYLE_PREFIX}-text">
        If you insist on accessing the site, please click the link below. Rabby will not be responsible for the security of your assets.
        </p>
      </div>
      <div class="${STYLE_PREFIX}-footer">
        <button class="${STYLE_PREFIX}-close">Close</button>
        <a href="#" class="${STYLE_PREFIX}-continue">I'm aware of the risks and will continue to visit the site.</a>
      </div>
    `;

    this.el.appendChild(elMain);

    document.head.insertAdjacentHTML('beforeend', `<style>${style}</style>`);
    document.body.appendChild(this.el);

    this.closeButton = this.el.querySelector(`.${STYLE_PREFIX}-close`);
    this.continueButton = this.el.querySelector(`.${STYLE_PREFIX}-continue`);

    this.registerEvents();
  }

  private registerEvents() {
    this.closeButton?.addEventListener(
      'click',
      () => {
        this.props.onClose();
        this.hide();
      },
      false
    );

    this.continueButton?.addEventListener(
      'click',
      (e) => {
        e.preventDefault();
        this.props.onContinue();
        this.hide();
      },
      false
    );
  }
}
