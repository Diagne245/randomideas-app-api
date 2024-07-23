class Modal {
  constructor() {
    this._modalBtn = document.getElementById('modal-btn');
    this._modal = document.getElementById('modal');

    this._addEventListeners();
  }

  open = () => {
    this._modal.style.display = 'block';
  };
  
  close = () => {
    this._modal.style.display = 'none';
  };

  outsideClick = (e) => {
    if (e.target === this._modal) {
      this._modal.style.display = 'none';
    }
  };

  _addEventListeners() {
    this._modalBtn.addEventListener('click', this.open.bind(this));
    document.addEventListener('click', this.outsideClick.bind(this));
    document.addEventListener('closemodal', this.close.bind(this));
  }
}

export default Modal;
