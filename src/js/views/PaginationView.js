import View from "./View.js";
import icons from 'url:../../img/icons.svg' // Parcel 2

class PaginationView extends View{
    _parentEl = document.querySelector(".pagination");

    addHandlerClick(handler){
        this._parentEl.addEventListener("click" , function(e){
            const btn = e.target.closest(".btn--inline");
            // if clicks between the buttons or smt
            if(!btn) return;
            // calling the handler function with the page number want to go to
            handler(+btn.dataset.goto);
        })
    }

    _generateMarkUp(){
        const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);

        // if on page 1 and there are other pages
        if(this._data.page === 1 && numPages > 1)
            return `
            <button data-goto = "${this._data.page + 1}" class="btn--inline pagination__btn--next">
                <span>Page ${this._data.page + 1}</span>
                <svg class="search__icon">
                <use href="${icons}.svg#icon-arrow-right"></use>
                </svg>
            </button>
            `
        
        // if on page 1 and there are NO other pages
        if(this._data.page === 1 && numPages === 1)
            return ``
        
        // if on last page
        if(this._data.page === numPages)
            return `
            <button data-goto="${this._data.page - 1}" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                <use href="${icons}.svg#icon-arrow-left"></use>
                </svg>
                <span>Page ${this._data.page - 1}</span>
            </button>
            `
        
        // if on any other page in between
        if(this._data.page >= 1 && this._data.page < numPages )
            return `
            <button data-goto="${this._data.page - 1}" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                <use href="${icons}.svg#icon-arrow-left"></use>
                </svg>
                <span>Page ${this._data.page - 1}</span>
            </button>

            <button data-goto="${this._data.page + 1}" class="btn--inline pagination__btn--next">
                <span>Page ${this._data.page + 1}</span>
                <svg class="search__icon">
                <use href="${icons}.svg#icon-arrow-right"></use>
                </svg>
            </button>
            `
    }


}

export default new PaginationView();