function pagination() {
  const itemsPerPage = 10; // Number of items to display per page
  let currentPage = 1; // Current page

  // Simulated data array
  const data = getSource();

  // Calculate total number of pages
  const totalPages = Math.ceil(data.length / itemsPerPage);

  //first page

  document.querySelector("#btn-first").addEventListener("click", function () {
    currentPage = 1;
    displayData();
  });

  // Previous page

  document
    .querySelector("#btn-previous")
    .addEventListener("click", function () {
      if (currentPage > 1) {
        currentPage--;
        displayData();
      }
    });

  // Next page link
  document.querySelector("#btn-next").addEventListener("click", function () {
    if (currentPage < totalPages) {
      currentPage++;
      displayData();
    }
  });

  // Last page link
  document.querySelector("#btn-last").addEventListener("click", function () {
    currentPage = totalPages;
    displayData();
  });
    
  // Function to display data based on the current page
  function displayData() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedData = data.slice(startIndex, endIndex);

    // Render displayedData to the dataContainer (e.g., create HTML elements)
    crearLaTabla(displayedData);
    // Render pagination links
    renderPagination();
  }

  // Function to render pagination links
  function renderPagination() {
    // Page number
    document.querySelector("#p-pagination").innerHTML =
      currentPage + " de " + totalPages;
  }

  // Initial display
  displayData();
}



