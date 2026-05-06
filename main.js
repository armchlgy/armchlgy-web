const agForm = document.getElementById('ag-form');
if (agForm) {
    agForm.addEventListener('submit', function (e) {
        e.preventDefault();
        agForm.classList.add('hidden');
        document.getElementById('confirmation').classList.remove('hidden');
    });
}

// Accordion Logic for Dossier Reveal
document.querySelectorAll('.accordion-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        // Toggle the button class
        this.classList.toggle('active');

        // Get the exact next element (the content block)
        const content = this.nextElementSibling;
        const icon = this.querySelector('.icon');

        if (content.classList.contains('open')) {
            // Close it
            content.style.maxHeight = null;
            content.classList.remove('open');
            icon.textContent = '+';
        } else {
            // Open it
            content.classList.add('open');
            // Set max height dynamically plus extra padding buffer so it doesn't get cut off
            content.style.maxHeight = content.scrollHeight + 150 + "px";
            icon.textContent = '-';
        }
    });
});

// Thumbnail Change Logic for Image Galleries
window.changeImage = function(mainImageId, thumbElement) {
    // Change main image source
    document.getElementById(mainImageId).src = thumbElement.src;

    // Remove 'active' class from all thumbs in this specific row
    const row = thumbElement.parentElement;
    row.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));

    // Add 'active' class to clicked thumb
    thumbElement.classList.add('active');
}
