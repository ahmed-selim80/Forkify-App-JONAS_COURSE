import View from "./View.js";
import icons from 'url:../../img/icons.svg' // Parcel 2

class AddRecipeView extends View{
    _parentEl = document.querySelector(".upload");
    _window = document.querySelector(".add-recipe-window");
    _overlay = document.querySelector(".overlay");
    _btnOpen = document.querySelector(".nav__btn--add-recipe");
    _btnClose = document.querySelector(".btn--close-modal");

    constructor(){
        super();
        this._addHandlerShowWindow();
        this._addHandlerHideWindow();
    }

    toggleWindow(){
        this._window.classList.toggle("hidden");
        this._overlay.classList.toggle("hidden");
    }

    _addHandlerShowWindow(){
        this._btnOpen.addEventListener("click" , this.toggleWindow.bind(this));
    }

    _addHandlerHideWindow(){
        this._btnClose.addEventListener("click" , this.toggleWindow.bind(this));
    }

    addHandlerUpload(handler){
        this._parentEl.addEventListener("submit" , function(e){
            e.preventDefault();
            const data = Object.fromEntries([...new FormData(this)]);
            handler(data);
        })
    }
 
}

export default new AddRecipeView();