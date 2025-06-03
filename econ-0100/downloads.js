// Download Handling Logic
// Centralized PDF and external link handling for carousel cards

document.addEventListener('DOMContentLoaded', function() {
    
    // Card click functionality
    document.querySelectorAll('.carousel-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't trigger card click if clicking on download link or icon
            if (e.target.classList.contains('card-download') || 
                e.target.classList.contains('fa-download') ||
                e.target.classList.contains('fa-external-link')) {
                return;
            }
            
            const videoId = card.getAttribute('data-video-id');
            if (videoId) {
                if (videoId.includes('.pdf') || videoId.includes('/')) {
                    window.open(videoId, '_blank');
                } else {
                    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
                }
            }
        });
        
        // Handle download icon clicks
        const downloadIcons = card.querySelectorAll('.fa-download');
        downloadIcons.forEach((icon, index) => {
            icon.addEventListener('click', (e) => {
                e.stopPropagation();
                const title = card.querySelector('.card-title').textContent;
                
                // Chapter downloads
                if (title.includes('Chapter 1')) window.open('Reading/Ch_01.pdf', '_blank');
                else if (title.includes('Chapter 2')) window.open('Reading/Ch_02.pdf', '_blank');
                else if (title.includes('Chapter 3')) window.open('Reading/Ch_03.pdf', '_blank');
                
                // Vignette downloads
                else if (title.includes('Vignette')) {
                    let vignetteNumber = '';
                    if (title.includes('Vignette A2')) vignetteNumber = 'A2';
                    else if (title.includes('Vignette A3')) vignetteNumber = 'A3';
                    else if (title.includes('Vignette A4')) vignetteNumber = 'A4';
                    else if (title.includes('Vignette A1')) vignetteNumber = 'A1';
                    
                    if (vignetteNumber) {
                        if (index === 0) {
                            window.open(`Vignettes/Vignette_${vignetteNumber}.pdf`, '_blank');
                        } else {
                            window.open(`Vignettes/Vignette_${vignetteNumber}_sols.pdf`, '_blank');
                        }
                    }
                }
                
                // Homework downloads
                else if (title.includes('Homework')) {
                    let homeworkNumber = '';
                    if (title.includes('Homework A1')) homeworkNumber = 'A1';
                    else if (title.includes('Homework A2')) homeworkNumber = 'A2';
                    else if (title.includes('Homework A3')) homeworkNumber = 'A3';
                    else if (title.includes('Homework A4')) homeworkNumber = 'A4';
                    
                    if (homeworkNumber) {
                        if (index === 0) {
                            window.open(`Homework/HW_${homeworkNumber}.pdf`, '_blank');
                        } else {
                            window.open(`Homework/HW_${homeworkNumber}_sols.pdf`, '_blank');
                        }
                    }
                }
                
                // Demo downloads (for standalone cards)
                else if (title.includes('Demo A')) {
                    if (index === 0) {
                        window.open('Demos/Demo_A.pdf', '_blank');
                    } else {
                        window.open('Demos/Demo_A_sols.pdf', '_blank');
                    }
                }
            });
        });
    });
});