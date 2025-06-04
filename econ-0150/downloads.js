// Simple download handler for part-1.html
document.addEventListener('DOMContentLoaded', function() {
    // Handle download icon clicks
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('fa-download') || e.target.classList.contains('fa-external-link')) {
            e.stopPropagation();
            
            const card = e.target.closest('.carousel-card');
            if (!card) return;
            
            const title = card.querySelector('.card-title').textContent;
            const icons = Array.from(card.querySelectorAll('.fa-download, .fa-external-link'));
            const index = icons.indexOf(e.target);
            
            // Define download mappings for part-1.html
            const downloads = {
                'Tutorial 1.0': ['Slides/Part_1_0.pdf'],
                'Tutorial 1.1': ['Slides/Part_1_1.pdf'], 
                'Tutorial 1.2': ['Slides/Part_1_2.pdf'],
                'Tutorial 1.3': ['Slides/Part_1_3.pdf'],
                'Tutorial 1.4': ['Slides/Part_1_4.pdf', 'Slides/Part_1_4.html'],
                'Tutorial 1.5': ['Slides/Part_1_5.pdf', 'Slides/Part_1_5.html'],
                'Tutorial 1.6': ['Slides/Part_1_6.pdf', 'Slides/Part_1_6.html', 'https://colab.research.google.com/drive/1iFwGWpFBSSMhkNZKqSTIwwoAW4N2J4Dj?usp=drive_link'],
                'Tutorial 1.7': ['Slides/Part_1_7.pdf', 'Slides/Part_1_7.html', 'https://colab.research.google.com/drive/1BEXhjPE7F_FQHzytkdESm0JUg-SONwPG?usp=sharing'],
                'Examples 1.0': ['https://drive.google.com/file/d/1OFCntgDuWrbvf9YPTLU7KNY3O-oKZp2N/view?usp=sharing', 'Examples/Part_1_0/binary_categorical_dataset.csv', 'Examples/Part_1_0/nominal_categorical_dataset.csv', 'Examples/Part_1_0/ordinal_categorical_dataset.csv'],
                'Example 1.1': ['Examples/Part_1_1/Coffee_Shops.csv', 'Examples/Part_1_1/Coffee_Shops.xlsx'],
                'Example 1.2': ['Examples/Part_1_2/Starbucks_Customer_Profiles.csv', 'Examples/Part_1_2/Starbucks_Customer_Profiles.xlsx', 'https://www.kaggle.com/datasets/ylchang/coffee-shop-sample-data-1113'],
                'Examples 1.3': ['https://drive.google.com/file/d/1YVc0_Kj6M6ymej1JZXMqFlOyFsXXKKv1/view?usp=sharing', 'Examples/Part_1_0/cross_sectional_numerical_dataset.csv', 'Examples/Part_1_0/time_series_numerical_dataset.csv', 'Examples/Part_1_0/panel_numerical_dataset.csv'],
                'Example 1.4': ['Examples/Part_1_4/Coffee_Sales_Reciepts.csv', 'Examples/Part_1_4/Coffee_Sales_Reciepts.xlsx', 'https://www.kaggle.com/datasets/ihormuliar/starbucks-customer-data'],
                'Example 1.5': ['Examples/Part_1_5/Starbucks_Location_Hours.csv'],
                'Example 1.6': ['Examples/Part_1_6/Starbucks_Promos.csv'],
                'Example 1.7': ['Examples/Part_1_7/Starbucks_Location_Hours.csv'],
                'Homework 01': ['HW/HW_01.pdf'],
                'Homework 02': ['HW/HW_02.pdf'],
                'Homework 03': ['HW/HW_03.pdf', 'https://colab.research.google.com/drive/1yJgeiNrjF98CIHULTmP1m7QBQZmlHTRk?usp=sharing']
            };
            
            // Find matching download
            for (const [key, urls] of Object.entries(downloads)) {
                if (title.includes(key) && urls[index]) {
                    window.open(urls[index], '_blank');
                    return;
                }
            }
        }
    });
});