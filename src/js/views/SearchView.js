class SearchView{
    _parentEl = document.querySelector(".search");

    _clear(){
        document.querySelector(".search__field").value = "";
    }
    addHandlerSearch(handler){
        this._parentEl.addEventListener("submit" , e =>{
            e.preventDefault();
            handler();
        })
    }
    getQuery(){
        const query = document.querySelector(".search__field").value;
        this._clear();
        return query;
    }
}

export default new SearchView();