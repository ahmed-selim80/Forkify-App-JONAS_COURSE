import {async} from "regenerator-runtime";
import * as helpers from "./helpers.js";
import * as config from "./config.js";
export const state = {
    recipe : {},
    search : {
        query : "",
        results : [],
        page : 1,
        resultsPerPage : config.RES_PER_PAGE,
    },
    bookmarks : [],
}

const createRecipeObject = function(data){
    let {recipe} = data.data;
    return {
        id : recipe.id,
        title : recipe.title,
        publisher : recipe.publisher,
        sourceURL : recipe.source_url,
        image : recipe.image_url,
        servings : recipe.servings,
        cookingTime : recipe.cooking_time,
        ingredients : recipe.ingredients,
        alt : recipe.alt,
        ...(recipe.key && {key : recipe.key}),
    }
}

export const loadRecipe = async function(id){
    try{
        const data = await helpers.AJAX(`${config.API_URL}${id}?key=${config.KEY}`)
        state.recipe = createRecipeObject(data);

        if(state.bookmarks.some(bookmark => bookmark.id === id))
            state.recipe.bookmarked = true;
        else state.recipe.bookmarked = false;


    }catch(err){
        alert(err);
        throw err;
    }
}


export const loadSearchResults = async function(query){
    try{
        state.search.query = query;
        const data = await helpers.AJAX(`${config.API_URL}?search=${query}&key=${config.KEY}`);
        state.search.results = data.data.recipes.map(rec =>{
            return {
                id : rec.id,
                title : rec.title,
                publisher : rec.publisher,
                image : rec.image_url,
                ...(rec.key && {key : rec.key}),
            }
        });
        state.search.page = 1;
    }catch(err){
        alert(err);
        throw err;
    }
}

export const getSearchResultsPage = function(page = state.search.page){
    state.search.page = page;
    const start = (page - 1) * state.search.resultsPerPage;
    const end = page * state.search.resultsPerPage;

    return state.search.results.slice(start , end);
}

export const updateServings = function(newServings){
    state.recipe.ingredients.forEach(ing =>{
        ing.quantity = ing.quantity * newServings / state.recipe.servings;
    })
    state.recipe.servings = newServings;
}

export const persistBookmarks = function(){
    localStorage.setItem("bookmarks" , JSON.stringify(state.bookmarks));
}

export const addBookMark = function(recipe){
    // add bookmark
    state.bookmarks.push(recipe);

    // Mark current recipe as bookmark
    if(recipe.id === state.recipe.id) state.recipe.bookmarked = true;
    persistBookmarks();
}

export const deleteBookMark = function(id){
    // Delete Bookmark
    const index = state.bookmarks.findIndex(rec => rec.id === id);
    state.bookmarks.splice(index , 1);

    // Mark current recipe as NOT bookmarked
    if(id === state.recipe.id) state.recipe.bookmarked = false;
    persistBookmarks();
}

export const uploadRecipe = async function(newRecipe){
    try{
        const ingredients = 
        Object.entries(newRecipe).filter(entry => entry[0].startsWith("ingredient") && entry[1] !== "")
        .map(ing => {
        const ingArr = ing[1].split(",").map(el => el.trim());
        if(ingArr.length != 3){
            throw new Error("Wrong ingredient format, please use the correct format ;)");
        }
        
        const [quantity , unit , description] = ingArr;
        return {quantity : quantity ? +quantity : null , unit , description};
        })

        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients,
        };

        const data = await helpers.AJAX(`${config.API_URL}?key=${config.KEY}`, recipe);
        
        state.recipe = createRecipeObject(data);
        console.log(state.recipe);
        
        addBookMark(state.recipe);
        
    }catch(err){
        throw err;
    }
}

const init = function(){
    const storage = JSON.parse(localStorage.getItem("bookmarks"));
    if(storage) state.bookmarks = storage;
}
init();