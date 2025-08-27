import View from "./View.js";
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg'; // Parcel 2

class SearchResults extends View{
    _parentEl = document.querySelector(".results");
    _errorMessage = "This Recipe Doesn't Exist!";

    _generateMarkUp(){
        return this._data.map(rec => previewView.render(rec , false)).join("");
    }
}

export default new SearchResults();