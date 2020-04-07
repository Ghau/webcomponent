let popinTemplate = document.createElement('template');
popinTemplate.innerHTML = `
<style type="text/css">
    :host {
        position: fixed;
        left: 0px; 
        right: 0px;
        top: 0px; 
        bottom: 0px;
        overflow: auto;
        opacity: 0;
        visibility: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(0,0,0,0.5);
        transition: all 0.4s ease;   
    }
    .block {
        box-shadow: 0px 0px 7px 1px grey;
        background-color: #fff;
        padding: 20px;
        min-width: 700px;
        min-height: 300px;
    }
    .close img {
        cursor: pointer;
    }
    .content {
        padding: 20px;
    }
</style>
<div class="block">
    <div class="close"><img src="icons-close_24.png"></div>
    <div class="content">
        <slot name="content"></slot>
    </div>
</div>
`;

customElements.define('popin-component', class extends HTMLElement {
    // Obligatoire afin d'écouter les changements sur la propriété modal grace a la méhode attributeChangedCallback
    static get observedAttributes() {
        return ['modal'];
    }

    constructor() {
        // Ne pas oublier d'appeler le constructeur de l'objet parent HTMLElement
        super();
        // Creation du shadowRoot puis ajout d'un clone du template
        this.attachShadow({mode: 'open'}).appendChild(popinTemplate.content.cloneNode(true));

        [this.close] = this.shadowRoot.querySelectorAll('img');

        this.isVisible = false;
        this.isModal = false;
    }

    // Après création du tag, ajout des divers événements
    connectedCallback() {
        this.close.addEventListener('click', e => !this.isModal && this.hide());

        document.addEventListener('keyup', e => !this.isModal && this.keyUp(e));
        this.addEventListener('click', e => !this.isModal && this.click(e));

        this.modal = !!this.getAttribute('modal');
    }

    // Ecoute de changement sur la propriété "modal"
    attributeChangedCallback(name, oldValue, newValue) {
        if (name !== 'modal') {
            return;
        }

        this.modal = newValue;
    }

    // Petite méthode pour détecter sur l'utilisateur a clické en dehors de la popin, si oui fermeture de la popin
    click(e) {
        const [block] = this.shadowRoot.querySelectorAll('div');
        let parent = e.originalTarget;
        while(parent) {
            if (parent === block) {
                return;
            }

            if (parent == this) {
                this.hide();
            }

            parent = parent.parentNode;
        }
    }

    // Si l'utilisateur appuye sur la touche échape fermeture de la popin
    keyUp(e) {
        if (e.key === 'Escape') {
            this.hide();
        }
    }

    show() {
        this.visible = true;
    }

    hide() {
        this.visible = false;
    }

    // Le setter de la propriété visible, c'est la réelle méthode qui ouvre et ferme la popin
    set visible(value) {
        this.isVisible = !!value;
        if (!!value) {
            this.style.visibility = 'visible';
            this.style.opacity = 1;

            return;
        }

        this.style.visibility = 'hidden';
        this.style.opacity = 0;
    }

    get visible() {
        return this.isVisible;
    }

    set modal(value) {
        this.isModal = !!value;
        this.close.style.display = !!value ? 'none' : 'block';
    }

    get modal() {
        return !!this.getAttribute('modal');
    }
});
