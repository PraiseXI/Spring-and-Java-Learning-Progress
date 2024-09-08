const initialPrerequisites = [
  {
    name: "Core Java Concepts",
    items: [
      { name: "Object-Oriented Programming (OOP)", completed: false },
      { name: "Exception Handling", completed: false },
      { name: "Generics", completed: false },
      { name: "Interfaces and Abstract Classes", completed: false },
    ],
    expanded: true,
  },
  {
    name: "Basic Understanding of Web Concepts",
    items: [
      { name: "HTTP Protocol", completed: false },
      {
        name: "REST (Representational State Transfer)",
        completed: false,
      },
      { name: "JSON", completed: false },
    ],
    expanded: true,
  },
  {
    name: "Java Annotations",
    items: [
      {
        name: "Basic understanding of Java annotations",
        completed: false,
      },
    ],
    expanded: true,
  },
  {
    name: "Dependency Injection and IoC",
    items: [
      { name: "Understanding Dependency Injection", completed: false },
      { name: "Inversion of Control (IoC)", completed: false },
    ],
    expanded: true,
  },
  {
    name: "Maven or Gradle",
    items: [
      { name: "Setting up project files", completed: false },
      { name: "Adding dependencies", completed: false },
      { name: "Running and building projects", completed: false },
    ],
    expanded: true,
  },
  {
    name: "Basic SQL and Database Knowledge",
    items: [
      { name: "SQL Basics", completed: false },
      { name: "JDBC (Java Database Connectivity)", completed: false },
      { name: "ORM Concepts", completed: false },
    ],
    expanded: true,
  },
  {
    name: "Version Control (Git)",
    items: [
      { name: "Basic Git commands", completed: false },
      { name: "GitHub or other Git platforms", completed: false },
    ],
    expanded: true,
  },
  {
    name: "Basic Unit Testing",
    items: [
      { name: "JUnit and Mockito", completed: false },
      { name: "Spring's testing support", completed: false },
    ],
    expanded: true,
  },
  {
    name: "Spring Ecosystem (Beginner Level)",
    items: [
      { name: "Spring Boot", completed: false },
      { name: "Spring MVC", completed: false },
      { name: "Spring Data JPA", completed: false },
      { name: "Spring Security", completed: false },
    ],
    expanded: true,
  },
  {
    name: "Tools and IDEs",
    items: [
      { name: "Comfortable with Java IDE", completed: false },
      { name: "Running and debugging from IDE", completed: false },
    ],
    expanded: true,
  },
];

let prerequisites =
  JSON.parse(localStorage.getItem("prerequisites")) || initialPrerequisites;

function renderPrerequisites() {
  const container = document.getElementById("prerequisites");
  container.innerHTML = "";

  prerequisites.forEach((category, categoryIndex) => {
    const categoryElement = document.createElement("div");
    categoryElement.className = "category";

    const header = document.createElement("div");
    header.className = "category-header";

    // Collapse button
    const toggleButton = document.createElement("span");
    toggleButton.className = "toggle-category-btn";
    toggleButton.innerHTML = category.expanded ? "▲" : "▼";
    toggleButton.onclick = () => toggleCategory(categoryIndex);

    // Category name
    const categoryName = document.createElement("span");
    categoryName.className = "category-name";
    categoryName.textContent = category.name;

    // Control buttons
    const controls = document.createElement("div");
    controls.className = "category-controls";
    controls.innerHTML = `
            <button class="reset-category-btn" onclick="resetCategory(${categoryIndex})">Reset</button>
            <button class="remove-category-btn" onclick="removeCategory(${categoryIndex})">Remove</button>
          `;

    header.appendChild(categoryName);
    header.appendChild(controls);
    header.appendChild(toggleButton); // Add collapse button after the controls

    const itemsList = document.createElement("ul");
    itemsList.className = `category-items ${
      category.expanded ? "expanded" : ""
    }`;

    category.items.forEach((item, itemIndex) => {
      const listItem = document.createElement("li");
      listItem.className = `item ${item.completed ? "completed" : ""}`;
      listItem.innerHTML = `
                <div class="checkbox ${
                  item.completed ? "checked" : ""
                }" onclick="toggleItem(${categoryIndex}, ${itemIndex})"></div>
                <span class="item-name">${item.name}</span>
                <button class="remove-item-btn" onclick="removeItem(${categoryIndex}, ${itemIndex})">Remove</button>
            `;
      itemsList.appendChild(listItem);
    });

    const addNewItemBtn = document.createElement("button");
    addNewItemBtn.className = "add-new-item-btn";
    addNewItemBtn.textContent = "+ Add New Item";
    addNewItemBtn.addEventListener("click", () =>
      showAddItemForm(categoryIndex)
    );

    categoryElement.appendChild(header);
    categoryElement.appendChild(itemsList);
    categoryElement.appendChild(addNewItemBtn);
    container.appendChild(categoryElement);
  });

  updateProgress();
}

function toggleCategory(categoryIndex) {
  prerequisites[categoryIndex].expanded =
    !prerequisites[categoryIndex].expanded;
  saveToLocalStorage();
  renderPrerequisites();
}

function toggleItem(categoryIndex, itemIndex) {
  prerequisites[categoryIndex].items[itemIndex].completed =
    !prerequisites[categoryIndex].items[itemIndex].completed;
  saveToLocalStorage();
  renderPrerequisites();
}

function updateProgress() {
  const totalItems = prerequisites.reduce(
    (sum, category) => sum + category.items.length,
    0
  );
  const completedItems = prerequisites.reduce(
    (sum, category) =>
      sum + category.items.filter(item => item.completed).length,
    0
  );
  const progressPercentage = (completedItems / totalItems) * 100;

  const progressBar = document.getElementById("progress");
  const progressText = document.getElementById("progress-text");

  progressBar.style.width = `${progressPercentage}%`;
  progressText.textContent = `${progressPercentage.toFixed(1)}% Complete`;
}

function showAddItemForm(categoryIndex) {
  const category = document.querySelectorAll(".category")[categoryIndex];
  const existingForm = category.querySelector(".add-item-form");

  if (existingForm) {
    existingForm.remove();
  } else {
    const form = document.createElement("div");
    form.className = "add-item-form";
    form.innerHTML = `
            <input type="text" placeholder="New item name">
            <button onclick="addNewItem(${categoryIndex})">Add</button>
        `;
    category.appendChild(form);
  }
}

function addNewItem(categoryIndex) {
  const category = document.querySelectorAll(".category")[categoryIndex];
  const input = category.querySelector(".add-item-form input");
  const newItemName = input.value.trim();

  if (newItemName) {
    prerequisites[categoryIndex].items.push({
      name: newItemName,
      completed: false,
    });
    saveToLocalStorage();
    renderPrerequisites();
  }
}

function addNewCategory() {
  const input = document.getElementById("new-category-input");
  const newCategoryName = input.value.trim();

  if (newCategoryName) {
    prerequisites.push({
      name: newCategoryName,
      items: [],
      expanded: true,
    });
    input.value = "";
    saveToLocalStorage();
    renderPrerequisites();
  }
}

function removeCategory(categoryIndex) {
  const confirmed = confirm("Are you sure you want to remove this category?");
  if (confirmed) {
    prerequisites.splice(categoryIndex, 1); // Remove category
    saveToLocalStorage();
    renderPrerequisites();
  }
}

function removeItem(categoryIndex, itemIndex) {
  const confirmed = confirm("Are you sure you want to remove this item?");
  if (confirmed) {
    prerequisites[categoryIndex].items.splice(itemIndex, 1); // Remove item
    saveToLocalStorage();
    renderPrerequisites();
  }
}

function resetCategories() {
  const confirmed = confirm("Are you sure you want to reset all category?");
  if (confirmed) {
    prerequisites = [...initialPrerequisites]; // Reset to initial state
    saveToLocalStorage();
    renderPrerequisites();
  }
}

function resetCategory(categoryIndex) {
  const confirmed = confirm("Are you sure you want to reset this category?");
  if (confirmed) {
    prerequisites[categoryIndex] = {
      ...initialPrerequisites[categoryIndex],
    }; // Reset the individual category
    saveToLocalStorage();
    renderPrerequisites();
  }
}

function saveToLocalStorage() {
  localStorage.setItem("prerequisites", JSON.stringify(prerequisites));
}

renderPrerequisites();
