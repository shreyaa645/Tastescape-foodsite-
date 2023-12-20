document.addEventListener("DOMContentLoaded", function () {
    // Get references to HTML elements
    const inputBox = document.getElementById("inputbox");
    const randomMealName = document.getElementById("random-meal-name");
    const randomMealImage = document.getElementById("random-meal").getElementsByTagName("img")[0];
    const categoryList = document.getElementById("category-list");

    // Event listener for user input in the search box
    inputBox.addEventListener("input", function () {
        // Get user input value
        const userInput = inputBox.value;

        // Clear previous search results
        randomMealName.textContent = "";
        randomMealImage.src = "";
        categoryList.innerHTML = "";

        if (userInput.trim() !== "") {
            // Fetch random meal based on user input category
            fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${userInput}`)
                .then((response) => response.json())
                .then((data) => {
                    if (data.meals) {
                        // Display random meal
                        const randomMeal = data.meals[Math.floor(Math.random() * data.meals.length)];
                        randomMealName.textContent = `"${randomMeal.strMeal}"`;
                        randomMealImage.src = randomMeal.strMealThumb;

                        // Display other meals from the category
                        data.meals.forEach((meal) => {
                            const listItem = document.createElement("li");
                            listItem.innerHTML = `
                                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                                <h2>${meal.strMeal}</h2>
                            `;
                            categoryList.appendChild(listItem);
                        });
                    } else {
                        randomMealName.textContent = "No results found for this category.";
                    }
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                });
        }
    });

    // Event listener for clicking on the random meal image
    randomMealImage.addEventListener("click", function () {
        // Get the name of the selected meal
        const mealName = randomMealName.textContent.replace(/"/g, "");

        // Fetch ingredients for the selected meal
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.meals && data.meals.length > 0) {
                    // Extract and display ingredients in a modal
                    const ingredients = [];
                    for (let i = 1; i <= 20; i++) {
                        const ingredient = data.meals[0][`strIngredient${i}`];
                        const measure = data.meals[0][`strMeasure${i}`];
                        if (ingredient && ingredient.trim() !== "") {
                            ingredients.push(`${measure} ${ingredient}`);
                        }
                    }
                    openModal(mealName, ingredients);
                } else {
                    console.log("No data found for ingredients.");
                }
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    });

    // Functions for opening and closing the modal
    function openModal(mealName, ingredients) {
        const modal = document.getElementById("myModal");
        const modalTitle = document.getElementById("modal-title");
        const ingredientsList = document.getElementById("ingredients-list");

        modalTitle.textContent = mealName;
        ingredientsList.innerHTML = ingredients.map(ingredient => `<li>${ingredient}</li>`).join('');
        modal.style.display = "block";
    }

    function closeModal() {
        const modal = document.getElementById("myModal");
        modal.style.display = "none";
    }

    // Event listeners to close the modal when clicking outside or pressing Escape key
    window.addEventListener("click", function (event) {
        const modal = document.getElementById("myModal");
        if (event.target === modal) {
            closeModal();
        }
    });

    document.addEventListener("keydown", function (event) {
        const modal = document.getElementById("myModal");
        if (event.key === "Escape") {
            closeModal();
        }
    });
});
