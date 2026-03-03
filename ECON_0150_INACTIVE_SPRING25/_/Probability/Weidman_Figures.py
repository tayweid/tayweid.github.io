# plot_config.py

import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import matplotlib.pyplot as plt
import plotly.express as px

from datetime import datetime, timedelta
import numpy as np

# Set Seaborn style
sns.set_style('whitegrid')

# Update Matplotlib parameters
plt.rcParams.update({
    'font.family': 'serif',              # Set the font family
    'font.serif': ['Times New Roman'],   # Use a specific serif font
    'font.size': 16,                     # Set the general font size
    'axes.titlesize': 16,                # Set the font size of the title
    'axes.labelsize': 16,                # Set the font size of axis labels
    'font.style': 'italic',              # Set the font style to italic
    'figure.dpi': 400   
})
category_color_pal = sns.color_palette("hls", 8)#sns.color_palette("husl", 8)
continuous_color_pal = sns.color_palette("rocket_r", as_cmap=True)

def Weid_Fig(rows=1, widths=5, height=3, dpi=400):

    total_width = 5
    if type(widths) == list:
        widths = [w/total_width for w in widths]
        cols = len(widths)
    if type(widths) in [int, int]:
        widths = [1]
        cols = 1
    
    fig, axes = plt.subplots(
        rows, 
        cols, 
        figsize=(10, height), 
        dpi=dpi,
        gridspec_kw={'width_ratios': widths}
        )
    
    return fig, axes

# Example usage:
# fig, axes = Weid_Fig(layout=(2, 1), widths=[6, 4], height=6, dpi=300)