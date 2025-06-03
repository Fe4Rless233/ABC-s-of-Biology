document.addEventListener('DOMContentLoaded', () => {
    const loaderWrapper = document.getElementById('loader-wrapper');
    const pageContent = document.getElementById('page-content');
    const container = document.getElementById('abc-container');

    if (!loaderWrapper || !pageContent || !container) {
        console.error("Essential page elements (loader, page-content, or abc-container) not found.");
        if(loaderWrapper) loaderWrapper.innerHTML = "<p>Error loading page structure.</p>";
        return;
    }

    if (typeof biologyABCData === 'undefined' || !Array.isArray(biologyABCData) || biologyABCData.length === 0) {
        console.error("Error: biologyABCData is not defined, not an array, or is empty.");
        container.innerHTML = "<p style='text-align:center; color:red;'>Error: No biology data found to display or data is in an incorrect format.</p>";
        if(loaderWrapper) loaderWrapper.style.display = 'none';
        if(pageContent) pageContent.style.opacity = '1';
        return;
    }

    biologyABCData.forEach(item => {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'letter-entry';

        const title = document.createElement('h2');
        title.textContent = `${item.letter}: ${item.term}`;
        entryDiv.appendChild(title);

        const contentGrid = document.createElement('div');
        contentGrid.className = 'content-grid';

        const photoContainer = document.createElement('div');
        photoContainer.className = 'photo-container';
        const photoHeader = document.createElement('h3');
        photoHeader.textContent = 'Photo:';
        photoContainer.appendChild(photoHeader);
        
        if (item.imageSrc && !item.imageSrc.toLowerCase().includes("replace_with_your_") && item.imageSrc.includes(".")) {
            const img = document.createElement('img');
            img.src = item.imageSrc;
            img.alt = `Photo illustrating ${item.term}`;
            img.onerror = function() {
                this.alt = `Error loading image for ${item.term}. Check path: ${this.src}`;
                this.parentNode.appendChild(createPhotoPlaceholder(`Error loading: ${item.imageSrc.split('/').pop()}. Check file name and path.`));
                this.remove();
            };
            photoContainer.appendChild(img);
        } else {
            photoContainer.appendChild(createPhotoPlaceholder(`[Your Original Photo for ${item.letter} Here - Ensure it meets all guidelines!]`));
        }
        contentGrid.appendChild(photoContainer);

        const detailsContainer = document.createElement('div');
        detailsContainer.className = 'details-container';

        const definitionHeader = document.createElement('h3');
        definitionHeader.textContent = 'Definition (in your own words):';
        detailsContainer.appendChild(definitionHeader);
        const definitionPara = document.createElement('p');
        definitionPara.className = 'definition-text';
        definitionPara.textContent = item.definition || `[Your definition for ${item.term} here. Remember project guidelines!]`;
        detailsContainer.appendChild(definitionPara);

        const explanationHeader = document.createElement('h3');
        explanationHeader.textContent = 'How the Photo Illustrates the Term:';
        detailsContainer.appendChild(explanationHeader);
        const explanationPara = document.createElement('p');
        explanationPara.textContent = item.explanation || `[Your explanation for ${item.term} here, describing your natural photo. Remember guidelines!]`;
        detailsContainer.appendChild(explanationPara);

        const unitHeader = document.createElement('h3');
        unitHeader.textContent = 'Unit/Topic:';
        detailsContainer.appendChild(unitHeader);
        const unitPara = document.createElement('p');
        unitPara.textContent = item.unit || `[Unit for ${item.term} here. Ensure all 8 are covered!]`;
        detailsContainer.appendChild(unitPara);

        contentGrid.appendChild(detailsContainer);
        entryDiv.appendChild(contentGrid);
        container.appendChild(entryDiv);
    });

    const letterEntries = document.querySelectorAll('.letter-entry');
    if ("IntersectionObserver" in window) {
        const entryObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { root: null, rootMargin: '0px', threshold: 0.1 });
        letterEntries.forEach(entry => { entryObserver.observe(entry); });
    } else {
        letterEntries.forEach(entry => { entry.classList.add('is-visible'); });
    }

    // Hide loader and show content
    // Use a small timeout to ensure content is rendered before fading out loader
    setTimeout(() => {
        if(loaderWrapper) loaderWrapper.style.opacity = '0';
        if(pageContent) pageContent.style.opacity = '1'; // Fade in content
        // Remove loader from DOM after transition
        if(loaderWrapper) setTimeout(() => { loaderWrapper.style.display = 'none'; }, 500);
    }, 200); // Adjust delay as needed, could be 0 if preferred

});

function createPhotoPlaceholder(text) {
    const photoPlaceholder = document.createElement('div');
    photoPlaceholder.className = 'photo-placeholder-text';
    photoPlaceholder.textContent = text;
    return photoPlaceholder;
}