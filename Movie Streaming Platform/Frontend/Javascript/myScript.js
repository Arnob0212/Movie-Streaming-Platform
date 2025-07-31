//carousel
document.addEventListener("DOMContentLoaded", function() {
    const carousels = document.querySelectorAll('.carousel');

    carousels.forEach(carousel => {
        carousel.addEventListener('mouseenter', () => {
            carousel.style.animationPlayState = 'paused';
        });

        carousel.addEventListener('mouseleave', () => {
            carousel.style.animationPlayState = 'running';
        });

        carousel.querySelectorAll('img').forEach(img => {
            img.addEventListener('mouseenter', () => {
                img.style.transform = 'scale(1.2)';
            });

            img.addEventListener('mouseleave', () => {
                img.style.transform = 'scale(1)';
            });
        });
    });
});

//movie
document.addEventListener("DOMContentLoaded", () => {
    const movieCards = document.querySelectorAll(".movie-card");

    movieCards.forEach(card => {
        card.addEventListener("click", () => {
            const movieData = {
                title: card.getAttribute("data-title"),
                description: card.getAttribute("data-description"),
                poster: card.getAttribute("src"),
                trailer: card.getAttribute("data-trailer"),
                movie: card.getAttribute("data-movie")
            };

            localStorage.setItem("selectedMovie", JSON.stringify(movieData));
            window.location.href = "movie.html";
        });
    });
});


function openModal(modalId) {
    document.getElementById(modalId).style.display = "flex";
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}

// Close modal when clicking outside the content box
window.onclick = function(event) {
    if (event.target.classList.contains("modal")) {
        event.target.style.display = "none";
    }
};

// Close modal when clicking the "×" button
document.querySelectorAll(".close").forEach(button => {
    button.addEventListener("click", function () {
        const modal = this.closest(".modal");
        if (modal) {
            modal.style.display = "none";
        }
    });
});
