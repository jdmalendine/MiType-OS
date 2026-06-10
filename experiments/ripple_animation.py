import os
import time
import math
import random

def get_terminal_size():
    """Returns the current width and height of the terminal."""
    try:
        size = os.get_terminal_size()
        return size.columns, size.lines
    except OSError:
        return 80, 24 # Default to a common terminal size

def clear_screen():
    """Clears the terminal screen."""
    os.system('cls' if os.name == 'nt' else 'clear')

# --- Pixel Font Definition ---
PIXEL_FONT = {
    'M': [
        "O   O",
        "OO OO",
        "O O O",
        "O   O",
        "O   O"
    ],
    'i': [
        " O ",
        "   ",
        " O ",
        " O ",
        " O "
    ],
    ' ': [
        "     ",
        "     ",
        "     ",
        "     ",
        "     "
    ],
    'T': [
        "OOOOO",
        "  O  ",
        "  O  ",
        "  O  ",
        "  O  "
    ],
    'y': [
        "O   O",
        "O   O",
        " O O ",
        "  O  ",
        "  O  "
    ],
    'p': [
        "OOOO ",
        "O  O ",
        "OOOO ",
        "O    ",
        "O    "
    ],
    'e': [
        "OOOOO",
        "O    ",
        "OOOO ",
        "O    ",
        "OOOOO"
    ]
}

# Global variable to store the current sparkle pattern and its update frame
_current_sparkle_pattern = None
_last_sparkle_update_frame = -1
_cached_text_dimensions = (0, 0) # Store dimensions of the text to generate pattern

def generate_sparkle_pattern(text_width, text_height, sparkle_factor):
    """Generates a new random sparkle pattern."""
    pattern = []
    for _ in range(text_height):
        row = []
        for _ in range(text_width):
            row.append(random.random() < sparkle_factor)
        pattern.append(row)
    return pattern

def render_text_frame(text, font, char_width, char_height, current_frame, 
                      fill_char='O', empty_char=' ', char_intensity_map=" .oO", 
                      sparkle_factor=0.2, sparkle_frame_interval=5):
    """
    Renders text into a block of characters with a controlled sparkling effect.
    """
    global _current_sparkle_pattern, _last_sparkle_update_frame, _cached_text_dimensions

    if not text:
        return [""] * char_height

    # Calculate total width of the rendered text
    total_text_width = sum(len(font.get(char, [''])) for char in text)
    
    # Update sparkle pattern only if interval has passed or dimensions changed
    if current_frame % sparkle_frame_interval == 0 or \
       _cached_text_dimensions != (total_text_width, char_height):
        _current_sparkle_pattern = generate_sparkle_pattern(total_text_width, char_height, sparkle_factor)
        _last_sparkle_update_frame = current_frame
        _cached_text_dimensions = (total_text_width, char_height)

    rendered_rows = [[] for _ in range(char_height)]
    non_fill_chars = char_intensity_map[:-1]

    # Keep track of the pixel column index for the sparkle pattern
    pixel_col_offset = 0

    for char_in_text in text:
        char_pixels = font.get(char_in_text, [''] * char_height)
        if not char_pixels or len(char_pixels) != char_height:
            char_pixels = [empty_char * char_width] * char_height

        for r_idx in range(char_height):
            current_row_pixels = []
            for c_idx, pixel_char in enumerate(char_pixels[r_idx]):
                if pixel_char == fill_char:
                    # Use the pre-generated sparkle pattern
                    sparkle_should_activate = False
                    if _current_sparkle_pattern: # Ensure pattern exists
                        # Map character pixel to global text block pixel
                        global_pixel_col = pixel_col_offset + c_idx
                        # Ensure we don't go out of bounds if pattern is smaller than text
                        if r_idx < len(_current_sparkle_pattern) and \
                           global_pixel_col < len(_current_sparkle_pattern[r_idx]):
                            sparkle_should_activate = _current_sparkle_pattern[r_idx][global_pixel_col]

                    if sparkle_should_activate:
                        current_row_pixels.append(random.choice(non_fill_chars)) # Still randomizes WHICH char
                    else:
                        current_row_pixels.append(fill_char)
                else:
                    current_row_pixels.append(empty_char)
            rendered_rows[r_idx].append("".join(current_row_pixels))
        
        pixel_col_offset += char_width # Move offset for the next character

    final_text_block = ["".join(row_parts) for row_parts in rendered_rows]
    return final_text_block


def create_ripple_frame(width, height, frame, max_frames, ripple_speed=0.5, char_intensity_map=" .oO"):
    """
    Creates a single frame of the ripple animation.
    """
    buffer = [[' ' for _ in range(width)] for _ in range(height)]
    center_x, center_y = width // 2, height // 2

    progress = (frame / max_frames) * 2 * math.pi

    for y in range(height):
        for x in range(width):
            dist = math.sqrt((x - center_x)**2 + (y - center_y)**2)
            wave = math.sin(dist * ripple_speed - progress)
            intensity_index = int(((wave + 1) / 2) * (len(char_intensity_map) - 1))
            intensity_index = max(0, min(intensity_index, len(char_intensity_map) - 1))
            buffer[y][x] = char_intensity_map[intensity_index]
    
    return "\n".join("".join(row) for row in buffer)

def display_content_centered(content_lines, term_width, term_height):
    """
    Displays the given content (list of lines) centered on the screen.
    """
    content_height = len(content_lines)
    if content_height == 0:
        return

    max_content_width = 0
    if content_height > 0:
        max_content_width = max(len(line) for line in content_lines)

    vertical_padding = (term_height - content_height) // 2
    horizontal_padding = (term_width - max_content_width) // 2

    clear_screen()
    
    output_lines = []
    for _ in range(vertical_padding):
        output_lines.append(" " * term_width)

    for line in content_lines:
        padded_line = " " * horizontal_padding + line
        if len(padded_line) > term_width:
            padded_line = padded_line[:term_width]
        else:
            padded_line += " " * (term_width - len(padded_line))
        output_lines.append(padded_line)
    
    for _ in range(vertical_padding):
        output_lines.append(" " * term_width)

    if len(output_lines) > term_height:
        output_lines = output_lines[:term_height]
    elif len(output_lines) < term_height:
        output_lines.extend([" " * term_width] * (term_height - len(output_lines)))

    print("\n".join(output_lines))

def run_animation_and_text(text_display_duration=2, ripple_duration=3, fps=20, sparkle_factor=0.3, sparkle_frame_interval=5):
    """
    First displays text with controlled sparkling, then runs the ripple animation.

    Args:
        text_display_duration (int): How long to display the text in seconds.
        ripple_duration (int): How long to run the ripple animation in seconds.
        fps (int): Frames per second for the animation.
        sparkle_factor (float): Probability (0.0 to 1.0) for a pixel to be 'sparkled off' when pattern is generated.
        sparkle_frame_interval (int): Number of frames before a new sparkle pattern is generated. Higher = slower sparkle.
    """
    term_width, term_height = get_terminal_size()

    # --- Display "Mi Type" with controlled sparkle ---
    text_to_display = "Mi Type"
    char_width = 5
    char_height = 5
    
    start_time = time.time()
    text_frame_count = 0 # Separate frame counter for text display

    while time.time() - start_time < text_display_duration:
        rendered_text = render_text_frame(
            text_to_display, PIXEL_FONT, char_width, char_height, 
            current_frame=text_frame_count, # Pass current frame for interval control
            fill_char='O', empty_char=' ', 
            char_intensity_map=" .oO",
            sparkle_factor=sparkle_factor,
            sparkle_frame_interval=sparkle_frame_interval # Pass the new parameter
        )
        
        display_content_centered(rendered_text, term_width, term_height)
        
        time.sleep(1 / fps)
        text_frame_count += 1


    # --- Run Ripple Animation ---
    animation_width = int(term_width * 0.7)
    animation_height = int(term_height * 0.7)

    if animation_width % 2 == 0: animation_width -= 1
    if animation_height % 2 == 0: animation_height -= 1

    max_frames = fps * 2
    
    start_time = time.time()
    ripple_frame_count = 0 # Separate frame counter for ripple animation

    try:
        while time.time() - start_time < ripple_duration:
            frame_content = create_ripple_frame(
                animation_width, animation_height, 
                ripple_frame_count % max_frames, max_frames,
                char_intensity_map=" .oO"
            )
            
            display_content_centered(frame_content.splitlines(), term_width, term_height)
            
            time.sleep(1 / fps)
            ripple_frame_count += 1
    except KeyboardInterrupt:
        print("\nAnimation stopped.")
    finally:
        clear_screen()

if __name__ == "__main__":
    print("Resizing your terminal for the best experience might be helpful.")
    print("Press Ctrl+C to stop the animation.")
    time.sleep(2)
    # --- Adjust sparkle_frame_interval to control sparkle speed ---
    # Higher value = slower, more sustained sparkle.
    # A value of 1 means sparkle changes every frame (fast).
    # A value of 5 means sparkle changes every 5 frames (slower).
    run_animation_and_text(text_display_duration=3, ripple_duration=5, fps=20, sparkle_factor=0.3, sparkle_frame_interval=5)