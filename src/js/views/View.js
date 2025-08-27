import icons from 'url:../../img/icons.svg' // Parcel 2
export default class View{
    _data;
    render(data , render = true){
        // check if data doesn't exist
        if(!data || (Array.isArray(data) && data.length === 0)) return this.renderError();
        
        this._data = data;
        const markup = this._generateMarkUp();

        if(!render) return markup;

        this._clear();
        this._parentEl.insertAdjacentHTML("afterbegin" , markup);
    }

    update(data) {
        this._data = data;
        const newMarkup = this._generateMarkUp();

        // this creates the virtual DOM
        const newDOM = document.createRange().createContextualFragment(newMarkup);
        // now selecting the elements and then creating an array of them

        const newElements = Array.from(newDOM.querySelectorAll('*'));
        const curElements = Array.from(this._parentEl.querySelectorAll('*'));


        newElements.forEach((newEl , i)=>{
            const currEl = curElements[i];
            console.log(currEl , newEl.isEqualNode(currEl));

            // Update Changed TEXT
            if(!newEl.isEqualNode(currEl) && newEl.firstChild?.nodeValue.trim() !== ''){
                currEl.textContent = newEl.textContent;
            }

            // Update Changed ATTRIBUTES
            if(!newEl.isEqualNode(currEl))
                Array.from(newEl.attributes).forEach(attr =>{
                    currEl.setAttribute(attr.name , attr.value);
                })
            
        })
    }

    renderSpinner(){
        const markup = `
            <div class="spinner">
            <svg>
                <use href="${icons}.svg#icon-loader"></use>
            </svg>
            </div>
        `;
        this._clear();
        this._parentEl.insertAdjacentHTML("afterbegin" , markup);
    }

    renderError(message = this._errorMessage){
        const markup = `
        <div class="error">
            <div>
            <svg>$
                <use href="${icons}.svg#icon-alert-triangle"></use>
            </svg>
            </div>
            <p>${message}</p>
        </div>
        `
        this._clear();
        this._parentEl.insertAdjacentHTML("afterbegin" , markup);
    }

    renderSuccess(message = this._successMessage){
        const markup = `
        <div class="error">
            <div>
            <svg>$
                <use href="${icons}.svg#icon-smile"></use>
            </svg>
            </div>
            <p>${message}</p>
        </div>
        `
        this._clear();
        this._parentEl.insertAdjacentHTML("afterbegin" , markup);
    }
    _clear(){
        if(this._parentEl) this._parentEl.innerHTML = '';
    }

    addHandlerRender(handler){
        for(let ev of ['hashchange' , 'load'])
        window.addEventListener(ev , handler);
    }
}

