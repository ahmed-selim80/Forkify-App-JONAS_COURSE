import "core-js/stable";
import "regenerator-runtime/runtime";
import * as model from "./model.js";
import RecipeView from "./views/RecipeView.js";
import SearchView from "./views/SearchView.js";
import ResultsView from "./views/SearchResultsView.js";
import PaginationView from "./views/PaginationView.js";
import bookmarkView from "./views/bookmarksView.js";
import AddRecipeView from "./views/addRecipeView.js";
import addRecipeView from "./views/addRecipeView.js";

if(module.hot){
  module.hot.accept();
}

const controlRecipe = async function(){
  try{
    // getting the different recipes
    const id = window.location.hash.slice(1);
    if(!id) return;

    // showing spinner until the data loads
    RecipeView.renderSpinner();

    // Update results to highlight the chosen recipe
    ResultsView.update(model.getSearchResultsPage());
    bookmarkView.update(model.state.bookmarks);

    // Loading Recipe
    await model.loadRecipe(id);

    // 2) Rendering Recipe
    RecipeView.render(model.state.recipe)

    // controlServings(8);

 
  }catch(err){
    alert(err);
    RecipeView.renderError(`${err.message} : ${err.state}`)
  }
}

const controlSearchResults = async function(){
  try{
    const query = SearchView.getQuery();
    if(!query) return;

    // showing spinner until the data loads
    ResultsView.renderSpinner();

    // getting the search data
    await model.loadSearchResults(query);

    // rendering the data to the screen
    ResultsView.render(model.getSearchResultsPage());

    // rendering the pagination buttons
    PaginationView.render(model.state.search);

  }catch(err){
    console.error(err);
  }
}

const controlPagination = function(pageNum){
  // rendering the NEW data to the screen
    ResultsView.render(model.getSearchResultsPage(pageNum));

    // rendering the NEW pagination buttons
    PaginationView.render(model.state.search);
}

const controlServings = function(servings){
  // Update the servings
  model.updateServings(servings);
  // Update the view
  RecipeView.update(model.state.recipe);
}

const controlBookMark = function(){
  // Add/Remove bookmark
  if(!model.state.recipe.bookmarked) model.addBookMark(model.state.recipe);
  else model.deleteBookMark(model.state.recipe.id);

  // Update bookmark
  RecipeView.update(model.state.recipe)

  // render all bookmarks
  bookmarkView.render(model.state.bookmarks);
}

const controlBookMarkRender = function(){
  bookmarkView.render(model.state.bookmarks);
}


const controlRecipeUpload = async function(data){
  try{
    // Show loading spinner
    addRecipeView.renderSpinner();

    // uploading recipe data
    await model.uploadRecipe(data);

    // Render the newly added recipe
    RecipeView.render(model.state.recipe);

    // Render Success Message
    addRecipeView.renderSuccess("Added Successfully ✅");

    // Render bookmark in the bookmarks tab
    bookmarkView.render(model.state.bookmarks);

    // Changing the URL
    window.history.pushState(null , "" , `#${model.state.recipe.id}`);

    // Close the open form
    setTimeout(()=>{
      addRecipeView.toggleWindow()
    } , 2500);

  }catch(err){
    AddRecipeView.renderError(err.message);
  }
}

const init = function(){
  bookmarkView.addHandlerRender(controlBookMarkRender);
  RecipeView.addHandlerRender(controlRecipe);
  RecipeView.addHandlerUpdateServings(controlServings);
  SearchView.addHandlerSearch(controlSearchResults);
  PaginationView.addHandlerClick(controlPagination);
  RecipeView.addHandlerBookMark(controlBookMark);
  AddRecipeView.addHandlerUpload(controlRecipeUpload);
}
init();