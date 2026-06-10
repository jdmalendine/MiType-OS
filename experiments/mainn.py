import os
import sys
import json
import re
import time
import math
import random # Added for sparkling effect

# Import for single character input
if os.name == 'nt':
    import msvcrt
else:
    import tty
    import termios

# Import your questions (assuming these exist in mi_type_assessments.py)
try:
    from mi_type_assessments import ALL_QUESTIONS, HBDI_QUESTIONS, MBTI_QUESTIONS
except ImportError:
    print("Error: mi_type_assessments.py not found or contains errors.")
    print("Please ensure you have ALL_QUESTIONS, HBDI_QUESTIONS, and MBTI_QUESTIONS defined.")
    sys.exit(1)

# Import your Mi Type profiles and helper functions (assuming these exist in mi_type_profiles.py)
try:
    from mi_type_profiles import MI_TYPE_PROFILES, get_profile, list_all_profiles
except ImportError:
    print("Error: mi_type_profiles.py not found or contains errors.")
    print("Please ensure you have MI_TYPE_PROFILES, get_profile, and list_all_profiles defined.")
    sys.exit(1)


# --- Configuration ---
SAVES_DIR = "saves"

# Ensure the saves directory exists
if not os.path.exists(SAVES_DIR):
    os.makedirs(SAVES_DIR)

# --- Utility Functions ---
def clear_screen():
    """Clears the terminal screen."""
    if os.name == 'nt':
        os.system('cls')
    else:
        os.system('clear')

def get_terminal_size():
    """
    Returns the current width and height of the terminal.
    Includes robust error handling for environments where size cannot be determined.
    """
    try:
        size = os.get_terminal_size()
        return size.columns, size.lines
    except Exception as e: # Catch any exception, not just OSError
        print(f"Warning: Could not determine terminal size ({type(e).__name__}: {e}). Using default 80x24.")
        return 80, 24 # Default to a common terminal size


def get_single_char_input(prompt=""):
    """
    Reads a single character from stdin without requiring the user to press Enter.
    Handles both Windows and Unix-like systems.
    Includes an optional prompt.
    """
    sys.stdout.write(prompt) # Print the prompt
    sys.stdout.flush()       # Ensure it's displayed immediately

    if os.name == 'nt':
        # Windows
        # msvcrt.getch() returns bytes, decode it
        char = msvcrt.getch().decode('utf-8')
    else:
        # Unix-like (Linux, macOS)
        fd = sys.stdin.fileno()
        old_settings = termios.tcgetattr(fd)
        try:
            tty.setraw(fd) # Set terminal to raw mode (no buffering)
            char = sys.stdin.read(1) # Read one character
        finally:
            termios.tcsetattr(fd, termios.TCSADRAIN, old_settings) # Restore terminal settings
    
    return char

def animated_progress_bar():
    """
    Displays an animated progress bar with varying messages and percentage.
    """
    clear_screen()
    
    messages = [
        "Analysing results",
        "Checking quadrants",
        "Making final assessments",
        "Compiling data",
        "Finalizing report"
    ]
    
    total_steps = 100
    animation_speed = 0.05  # Adjust this value for faster/slower animation

    print("Loading...\n") # Initial message to show something is happening

    for i in range(total_steps + 1):
        progress = i
        bar_length = 50
        filled_length = int(bar_length * progress / total_steps)
        bar = '█' * filled_length + '-' * (bar_length - filled_length)
        percentage = f"{progress:.0f}%"

        # Dynamically change messages
        if progress < 20:
            current_message = messages[0]
        elif progress < 40:
            current_message = messages[1]
        elif progress < 60:
            current_message = messages[2]
        elif progress < 80:
            current_message = messages[3]
        else:
            current_message = messages[4]
            
        sys.stdout.write(f"\r{current_message}: [{bar}] {percentage}")
        sys.stdout.flush()
        time.sleep(animation_speed)

    print("\n\nComplete!")
    print("Your Mi Type results are ready.")
    # No input() here, the next step will be handled by the quiz flow
    # The clear_screen after this prompt will be handled by display_mi_type_results_paginated
    # or the main menu loop, depending on the user's choice.


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

# Global variables to store the current sparkle pattern and its update frame
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

def render_text_frame(text, font, char_width, char_height, 
                      current_frame, fill_char='O', empty_char=' ', char_intensity_map=" .oO", 
                      sparkle_factor=0.2, sparkle_frame_interval=5):
    """
    Renders text into a block of characters with a controlled sparkling effect.
    """
    global _current_sparkle_pattern, _last_sparkle_update_frame, _cached_text_dimensions

    if not text:
        return [""] * char_height

    # Calculate total width of the rendered text
    # Each character in PIXEL_FONT has a defined width (e.g., 'M' is 5, 'i' is 3, ' ' is 5)
    # We need to sum up the actual pixel widths of each character in the text.
    total_text_width = sum(len(font.get(char, [''])[0]) if font.get(char) and font.get(char)[0] else char_width for char in text)
    
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
            # Fallback if character not in font or malformed
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
            
        # Adjust pixel_col_offset by the actual width of the character just processed
        pixel_col_offset += len(char_pixels[0]) if char_pixels and char_pixels[0] else char_width

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
    # Character dimensions are now derived from the font definition
    char_height = 5 
    
    start_time = time.time()
    text_frame_count = 0 # Separate frame counter for text display

    while time.time() - start_time < text_display_duration:
        rendered_text = render_text_frame(
            text_to_display, PIXEL_FONT, # Pass PIXEL_FONT directly
            char_width=5, char_height=char_height, # char_width is a placeholder, actual width comes from font
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


# --- DUMMY TINYTROUPE INTEGRATION (REPLACE WITH REAL LIBRARY) ---
# These classes simulate how TinyTroupe might work conceptually.
# You would replace this with actual TinyTroupe imports and API calls.

class _DummyTinyPerson:
    """
    A placeholder for a TinyTroupe TinyPerson.
    In a real scenario, this would interact with an LLM.
    """
    def __init__(self, name, persona_description):
        self.name = name
        self.persona_description = persona_description
        self.context = ""
        # Simulate a very basic knowledge base or memory
        self.responses = {
            "strength": "Your strength is a powerful asset! How do you envision using it to achieve your goals?",
            "egotend": "Egotends are areas for growth. Let's explore how you can transform this challenge into a higher tendency.",
            "goal": "Setting clear goals is key. How does your Mi Type influence your approach to goal setting?",
            "challenge": "Challenges are opportunities disguised. How might your unique Mi Type help you navigate this particular hurdle?",
            "general": "That's an interesting thought! How does that relate to your Mi Type or your personal development journey?",
            "welcome": f"Hello! As your Mi Type coach, I'm here to help you understand and leverage your Mi Type profile for growth. What's on your mind today, especially regarding your Mi Type?"
        }

    def add_context(self, text):
        # In a real LLM integration, this context would be fed to the LLM.
        self.context += text + "\n"

    def get_reply(self, user_message):
        """
        Simulates a reply from the TinyPerson.
        In a real TinyTroupe, this would call an LLM API.
        """
        user_message_lower = user_message.lower()
        if "strength" in user_message_lower:
            return self.responses["strength"]
        elif "egotend" in user_message_lower or "challenge" in user_message_lower:
            return self.responses["egotend"]
        elif "goal" in user_message_lower:
            return self.responses["goal"]
        elif "hello" in user_message_lower or "hi" in user_message_lower:
             return self.responses["welcome"]
        else:
            return self.responses["general"]

class _DummyTinyTroupeLibrary:
    """
    A placeholder for the TinyTroupe library interface.
    """
    def create_person(self, name, persona_description):
        print(f"\n[DUMMY TinyTroupe: Creating {name} with persona: {persona_description[:50]}...]")
        # In a real TinyTroupe, this might involve LLM setup
        return _DummyTinyPerson(name, persona_description)

    # In a real library, you might have an initialize method for API keys etc.
    # def initialize(self, api_key):
    #    print("[DUMMY TinyTroupe: Initializing with API key...]")
    #    self.api_key = api_key

# Instantiate the dummy library to be used below
_dummy_tiny_troupe_library = _DummyTinyTroupeLibrary()


def start_tiny_coach_session(user_mi_profile_data, user_raw_answers):
    """
    Initiates a chat session with an AI Mi Type Coach (TinyPerson).
    """
    clear_screen()
    print("--- Connecting to your Mi Type Coach ---")
    print("Please wait while the AI coach prepares...")
    print("-----------------------------------------------------")
    print("NOTE: This is a dummy coach. For real AI interaction,")
    print("      you'll need to integrate the actual TinyTroupe")
    print("      library and an LLM API key.")
    print("-----------------------------------------------------")
    time.sleep(2) # Simulate connection time

    try:
        # --- Conceptual TinyTroupe Integration ---
        # 1. Initialize TinyTroupe (if needed)
        # In a real setup: _dummy_tiny_troupe_library.initialize(api_key="YOUR_LLM_API_KEY") 
        # (Remember to securely manage your API key, not hardcode it!)

        # 2. Define the coach persona
        coach_persona = f"""
        You are an experienced Mi Type Personal Development Coach.
        Your goal is to help individuals understand and leverage their unique Mi Type profile for personal and professional growth.
        You are supportive, insightful, and encourage self-reflection.
        """

        # 3. Create a TinyPerson (the coach)
        mi_coach = _dummy_tiny_troupe_library.create_person(
            name="Mi Type Coach", 
            persona_description=coach_persona
        )

        # 4. Provide the user's Mi Type profile as context to the coach
        profile_context = f"""
        The user you are coaching has the following Mi Type profile:
        Name: {user_mi_profile_data.get('name', 'N/A')}
        Overview: {user_mi_profile_data.get('overview', 'N/A')}
        Strengths: {', '.join(user_mi_profile_data.get('strengths', []))}
        Egotends (potential challenges): {', '.join(user_mi_profile_data.get('egotends', []))}
        Highertends (growth path): {', '.join(user_mi_profile_data.get('highertends', []))}
        Change Threshold: {user_mi_profile_data.get('change_threshold', 'N/A')}

        Your current focus is to help THIS user based on THIS information.
        """
        mi_coach.add_context(profile_context)

        print("\n-----------------------------------------------------")
        print("Your Mi Type Coach is ready. What's on your mind?")
        print("Type 'quit' or 'exit' to end the session.")
        print("-----------------------------------------------------")
        print(f"\nCoach: {mi_coach.responses['welcome']}") # Initial greeting from coach

        # 5. Start the chat loop
        while True:
            user_input = input("\nYou: ").strip()
            if user_input.lower() in ['quit', 'exit']:
                print("\nEnding session with Mi Type Coach. Goodbye!")
                break
            
            if not user_input:
                print("Please type something to the coach.")
                continue

            coach_response = mi_coach.get_reply(user_input)
            print(f"\nCoach: {coach_response}")

    except Exception as e: # Catch any errors from the dummy or real TinyTroupe
        print(f"\nAn error occurred during the coaching session: {e}")
        print("Ensure TinyTroupe is correctly set up and LLM API keys are valid if using a real implementation.")
    finally:
        input("\nPress Enter to return to Mi Type results...")
        clear_screen() # Clear screen before returning to results


def display_main_menu():
    """Displays the main menu options."""
    # NO clear_screen() here. It will be called by main_app before this is printed.
    print("--- Welcome to the Mi Type Assessment ---")
    print("\nPlease choose an option:")
    print("1. Start New Assessment")
    print("2. View Mi Type Profiles")
    print("3. What are Egotends and Highertends?")
    print("4. Load Saved Progress")
    print("5. Export Raw Answers (from last completed/saved session)")
    print("6. Analyze Raw Answers (manual input)")
    print("7. Analyze Raw Answers from File (.txt)")
    print("8. Exit")
    print("-----------------------------------------")

def view_profiles_menu():
    """Displays a menu of all profiles and allows the user to select one."""
    all_profiles_list = list_all_profiles()
    
    profile_code_map = {
        "IE": "Imaginative Explorer", "TL": "Transformational Leader", "ID": "Innovative Designer",
        "HI": "Holistic Integrator", "CPS": "Creative Problem Solver", "VC": "Visionary Conceptualizer",
        "PA": "Passionate Advocate", "RB": "Relationship Builder", "PC": "Personalized Coach",
        "DM": "Dynamic Motivator", "EC": "Expressive Communicator", "MP": "Methodical Producer",
        "RE": "Reliable Executor", "ES": "Empathetic Supporter", "SC": "Structured Communicator",
        "DO": "Detailed Organizer", "HF": "Harmonious Facilitator", "SI": "Systematic Implementer",
        "SP": "Strategic Planner", "IS": "Intuitive Strategist", "AA": "Adaptive Analyst",
        "EA": "Efficient Analyst", "LI": "Logical Innovator", "HA": "Harmonious Analyst",
    }


    while True:
        clear_screen()
        print("--- View Mi Type Profiles ---")
        print("\nSelect a profile to view details:")

        # Split into two columns
        num_profiles = len(all_profiles_list)
        
        # Determine the number of items per column, aiming for 12 in the first column if possible
        items_per_column = 12
        
        column1 = all_profiles_list[:items_per_column]
        column2 = all_profiles_list[items_per_column:]

        # Calculate max length for the first column to ensure proper justification
        max_len_col1 = 0
        if column1:
            # Format string for numbering and name, then find max length
            max_len_col1 = max(len(f"{i + 1}. {name}") for i, name in enumerate(column1))

        # Print profiles side-by-side
        for i in range(max(len(column1), len(column2))):
            line = ""
            # First column item
            if i < len(column1):
                idx1 = i
                name1 = column1[idx1]
                # Use ljust to justify the first column
                line += f"{idx1 + 1}. {name1}".ljust(max_len_col1 + 5) # +5 for spacing between columns
            else:
                line += " " * (max_len_col1 + 5) # Empty space if first column is shorter

            # Second column item
            if i < len(column2):
                idx2 = items_per_column + i # Adjust index for the second column
                name2 = column2[i]
                line += f"{idx2 + 1}. {name2}"
            print(line)

        print("\n-----------------------------------------------------")
        print("Enter the number (e.g., 1) or code (e.g., 'IE') of the profile.")
        print("Type 'back' to return to the main menu.")
        print("-----------------------------------------------------")

        user_input = input("\nYour choice: ").strip()

        if user_input.lower() == 'back':
            return
        
        selected_profile_name = None

        if user_input.isdigit():
            choice_num = int(user_input)
            if 1 <= choice_num <= len(all_profiles_list):
                selected_profile_name = all_profiles_list[choice_num - 1]
        else:
            normalized_input_code = user_input.upper()  
            selected_profile_name = profile_code_map.get(normalized_input_code)
            
            if not selected_profile_name:
                for name in all_profiles_list:
                    if name.lower() == user_input.lower():
                        selected_profile_name = name
                        break

        if selected_profile_name:
            # Call the display_single_profile_details function
            display_single_profile_details(selected_profile_name) 
        else:
            print(f"Invalid selection: '{user_input}'. Please try again.")
            input("Press Enter to continue...")

# --- Assessment Functions ---
def run_assessment_quiz(initial_answers=None, start_index=0):
    """
    Administers the assessment quiz to the user.
    Can resume from a previous session if initial_answers and start_index are provided.
    Collects chosen option letters (e.g., 'A', 'B') for each question.
    """
    clear_screen()
    print("--- Starting Mi Type Assessment ---")
    print("Select an option (A, B, C, D) or type 'S' to Save and Exit.")
    print("-----------------------------------")

    # answers will store {question_index: chosen_option_letter}
    answers = initial_answers if initial_answers is not None else {}
    
    # ALL_QUESTIONS is imported from mi_type_assessments.py
    # Each item in ALL_QUESTIONS is a dictionary representing a question.

    for i in range(start_index, len(ALL_QUESTIONS)):
        question_data = ALL_QUESTIONS[i]
        question_text = question_data["question"]
        options = question_data["options"]

        while True:
            clear_screen() # Clear screen for each new question
            print(f"Question {i + 1}/{len(ALL_QUESTIONS)}:")
            print(f"\n{question_text}\n")
            
            # Display options dynamically
            for option_key, option_text in options.items():
                print(f"  {option_key}) {option_text}")

            user_response = get_single_char_input("\nYour choice (A/B/C/D/S): ").strip().upper()

            if user_response in options: # Check if it's a valid option key
                answers[i] = user_response # Store the chosen option letter
                break
            elif user_response == 'S':
                # Save progress and exit assessment
                save_progress(answers, i) 
                print("\nAssessment saved. Returning to main menu.")
                input("Press Enter to continue...")
                return None # Indicate that the quiz was not completed
            else:
                print("Invalid input. Please enter A, B, C, D, or S.")
                time.sleep(1) # Give user time to read error message

    clear_screen()
    print("--- Assessment Complete! ---")
    print("Calculating your Mi Type profile...")
    animated_progress_bar() # Show a progress bar while processing

    # Once answers are collected, calculate the Mi Type and display results
    mi_type_result, raw_scores = calculate_mi_type(answers) # calculate_mi_type will also return raw scores
    display_mi_type_results_paginated(mi_type_result, answers) # Pass raw answers for coach session

    return answers # Return the raw answers for potential export/analysis later


def calculate_mi_type(answers):
    """
    Calculates the user's Mi Type based on their answers.
    Uses the score_map from each question to aggregate scores for HBDI and MBTI dimensions.
    Returns the determined Mi Type profile and the raw scores.
    """
    # Initialize scores for HBDI and MBTI dimensions
    scores = {
        "hbdi_a": 0, "hbdi_b": 0, "hbdi_c": 0, "hbdi_d": 0,
        "mbti_e": 0, "mbti_i": 0, # Extroversion (E) / Introversion (I)
        "mbti_s": 0, "mbti_n": 0, # Sensing (S) / Intuition (N)
        "mbti_t": 0, "mbti_f": 0, # Thinking (T) / Feeling (F)
        "mbti_j": 0, "mbti_p": 0  # Judging (J) / Perceiving (P)
    }

    for i, chosen_option in answers.items():
        if i < len(ALL_QUESTIONS): # Ensure the question index is valid
            question_data = ALL_QUESTIONS[i]
            score_map_for_question = question_data["score_map"]

            if chosen_option in score_map_for_question:
                # Get the dimension scores for the chosen option
                dimension_scores = score_map_for_question[chosen_option]
                for dimension, value in dimension_scores.items():
                    if dimension in scores: # Add score to the corresponding dimension
                        scores[dimension] += value
    
    print("\n[DEBUG] Raw Scores after calculation:", scores) # Debugging line

    # --- Determine HBDI Dominance (e.g., A, B, C, D) ---
    hbdi_quadrants = {
        "A": scores["hbdi_a"],
        "B": scores["hbdi_b"],
        "C": scores["hbdi_c"],
        "D": scores["hbdi_d"]
    }
    # Find the quadrant with the highest score
    dominant_hbdi_quadrant = max(hbdi_quadrants, key=hbdi_quadrants.get)

    # --- Determine MBTI Preferences ---
    mbti_type = ""
    mbti_type += "E" if scores["mbti_e"] >= scores["mbti_i"] else "I"
    mbti_type += "S" if scores["mbti_s"] >= scores["mbti_n"] else "N"
    mbti_type += "T" if scores["mbti_t"] >= scores["mbti_f"] else "F"
    mbti_type += "J" if scores["mbti_j"] >= scores["mbti_p"] else "P"

    print(f"[DEBUG] Dominant HBDI: {dominant_hbdi_quadrant}")
    print(f"[DEBUG] MBTI Type: {mbti_type}")

    # --- Map combined HBDI and MBTI to a Mi Type Profile ---
    # This is a placeholder for your actual mapping logic.
    # You need to define how combinations of dominant HBDI quadrants and MBTI types
    # map to your specific MI_TYPE_PROFILES.
    # For example, if 'IE' (Imaginative Explorer) is your profile for a certain combination:
    
    # **IMPORTANT: This is where you would build out your specific logic**
    # to translate the scores (or the derived HBDI quadrant/MBTI type)
    # into one of your `MI_TYPE_PROFILES`.
    # As I don't have the internal logic of how these map, I'll provide a very
    # simplified example and explain that you'll need to expand this.

    mi_type_code = "IE" # Default fallback
    
    # Example simplified mapping (YOU WILL NEED TO REPLACE/EXPAND THIS):
    # This logic is purely illustrative. You will need to design your own precise
    # mapping based on how you define your Mi Type profiles.
    if dominant_hbdi_quadrant == "A" and mbti_type[0] == "E": 
        mi_type_code = "EA" 
    elif dominant_hbdi_quadrant == "D" and mbti_type[1] == "N": 
        mi_type_code = "VC" 
    elif dominant_hbdi_quadrant == "C" and mbti_type[2] == "F": 
        mi_type_code = "RB" 
    elif dominant_hbdi_quadrant == "B" and mbti_type[3] == "J": 
        mi_type_code = "RE" 
    elif dominant_hbdi_quadrant == "A" and mbti_type[2] == "T":
        mi_type_code = "LI" # Logical Innovator
    elif dominant_hbdi_quadrant == "D" and mbti_type[3] == "P":
        mi_type_code = "IS" # Intuitive Strategist
    elif dominant_hbdi_quadrant == "C" and mbti_type[0] == "I":
        mi_type_code = "ES" # Empathetic Supporter
    elif dominant_hbdi_quadrant == "B" and mbti_type[1] == "S":
        mi_type_code = "DO" # Detailed Organizer

    # ... add more specific mapping logic based on your MI_TYPE_PROFILES.
    # Consider using a more structured lookup (e.g., a dictionary of mappings)
    # if your mapping becomes very complex.

    profile = get_profile(mi_type_code) # Assuming get_profile works
    if not profile:
        print(f"Warning: Profile for code '{mi_type_code}' not found. Using a generic fallback.")
        # Provide a very basic fallback if the determined profile doesn't exist
        profile = {
            "name": "Undefined Mi Type",
            "overview": "A generic profile for an unmapped type.",
            "strengths": ["Adaptability"],
            "egotends": ["Indecision"],
            "highertends": ["Clarity"],
            "change_threshold": "Moderate"
        }
    
    return profile, scores # Return both the profile and the raw scores


def display_mi_type_results_paginated(mi_type_profile, raw_answers):
    """
    Displays the detailed Mi Type profile results, paginated.
    Allows navigation and starting a coaching session.
    """
    profile = mi_type_profile
    pages = []

    # Page 1: Overview
    page1 = [
        "--- Your Mi Type Profile ---",
        "",
        f"Your Mi Type: {profile.get('name', 'N/A')}",
        "",
        "Overview:",
        f"{profile.get('overview', 'No overview available.')}",
        "",
        "--- Page 1/3 ---"
    ]
    pages.append(page1)

    # Page 2: Strengths & Egotends
    page2 = [
        "--- Your Mi Type Profile ---",
        "",
        "Strengths:",
        *[f"- {s}" for s in profile.get('strengths', ['No strengths listed.'])],
        "",
        "Egotends (Potential Challenges):",
        *[f"- {e}" for e in profile.get('egotends', ['No egotends listed.'])],
        "",
        "--- Page 2/3 ---"
    ]
    pages.append(page2)

    # Page 3: Highertends & Change Threshold
    page3 = [
        "--- Your Mi Type Profile ---",
        "",
        "Highertends (Growth Path):",
        *[f"- {h}" for h in profile.get('highertends', ['No highertends listed.'])],
        "",
        f"Change Threshold: {profile.get('change_threshold', 'N/A')}",
        "",
        "--- Page 3/3 ---",
        "",
        "Options:",
        "N: Next Page, P: Previous Page, C: Chat with AI Coach, M: Main Menu"
    ]
    pages.append(page3)

    current_page_index = 0
    while True:
        clear_screen()
        for line in pages[current_page_index]:
            print(line)

        choice = get_single_char_input("\nAction (N/P/C/M): ").strip().upper()

        if choice == 'N':
            current_page_index = (current_page_index + 1) % len(pages)
        elif choice == 'P':
            current_page_index = (current_page_index - 1 + len(pages)) % len(pages)
        elif choice == 'C':
            # This calls the dummy coach.
            start_tiny_coach_session(mi_type_profile, raw_answers)
            # After coach session, return to the first page of results
            current_page_index = 0 
            # Re-display the current page so the user sees the result after the chat
            continue # Continue the loop to allow N/P/C/M choices on results
        elif choice == 'M':
            break
        else:
            print("Invalid input. Please use 'N', 'P', 'C', or 'M'.")
            time.sleep(1) # Give user time to read error message


def save_progress(answers, current_question_index):
    """
    Saves the current assessment progress (answers and question index) to a JSON file.
    """
    filename = os.path.join(SAVES_DIR, "assessment_progress.json")
    save_data = {
        "answers": answers,
        "current_question_index": current_question_index
    }
    try:
        with open(filename, 'w') as f:
            json.dump(save_data, f, indent=4)
        print(f"\nProgress saved successfully to {filename}")
    except IOError as e:
        print(f"\nError saving progress: {e}")

def load_progress():
    """
    Loads saved assessment progress from a JSON file.
    """
    filename = os.path.join(SAVES_DIR, "assessment_progress.json")
    if not os.path.exists(filename):
        print("\nNo saved progress found.")
        input("Press Enter to continue...")
        return None, 0
    
    try:
        with open(filename, 'r') as f:
            save_data = json.load(f)
        print(f"\nProgress loaded successfully from {filename}")
        input("Press Enter to continue...")
        return save_data.get("answers", {}), save_data.get("current_question_index", 0)
    except json.JSONDecodeError as e:
        print(f"\nError reading saved progress file (corrupted JSON): {e}")
        input("Press Enter to continue...")
        return None, 0
    except IOError as e:
        print(f"\nError loading progress: {e}")
        input("Press Enter to continue...")
        return None, 0

def explain_egotends_highertends():
    """
    Explains the concepts of Egotends and Highertends.
    """
    clear_screen()
    print("--- Understanding Egotends and Highertends ---")
    print("\nEgotends:")
    print("Egotends represent potential blind spots or less developed aspects of your Mi Type.")
    print("They are tendencies that, if unchecked, can lead to challenges or limit your growth.")
    print("Think of them as areas where you might unconsciously over-rely on certain behaviors")
    print("or perspectives, leading to predictable pitfalls.")
    print("Recognizing your Egotends is the first step towards transforming them.")
    print("")
    print("Highertends:")
    print("Highertends are the evolved, more mature expressions of your Mi Type.")
    print("They represent the positive growth path for your inherent tendencies.")
    print("By consciously focusing on developing your Highertends, you can mitigate")
    print("the negative impacts of your Egotends and fully leverage your strengths.")
    print("It's about transcending your current limitations and reaching a higher potential.")
    print("\nEssentially: Egotends are 'where you might stumble', Highertends are 'how you rise'.")
    print("-----------------------------------------------")
    input("\nPress Enter to return to the main menu...")

def export_raw_answers_menu_option(raw_answers):
    """
    Handles the menu option for exporting raw answers.
    """
    clear_screen()
    if raw_answers is None:
        print("No completed or loaded assessment answers to export.")
        input("Press Enter to continue...")
        return

    print("--- Export Raw Answers ---")
    filename = input("Enter filename to save raw answers (e.g., my_answers.txt): ").strip()
    if not filename:
        print("Export cancelled.")
        input("Press Enter to continue...")
        return

    file_path = os.path.join(SAVES_DIR, filename)
    try:
        # Save as a more readable format, perhaps: Question_Index: Chosen_Option_Letter
        with open(file_path, 'w') as f:
            for q_idx, chosen_option in sorted(raw_answers.items()):
                # Optionally, you could try to get the question text here too for more context
                # For simplicity, just storing index and option for now.
                f.write(f"Question {q_idx + 1}: {chosen_option}\n")
        print(f"\nRaw answers exported successfully to {file_path}")
    except IOError as e:
        print(f"\nError exporting answers: {e}")
    input("Press Enter to continue...")

def analyze_raw_answers_manual_option():
    """
    Allows manual input of raw answers for analysis.
    This function will now expect input like "1: A", "2: D" etc.,
    where 1 is question index (0-based + 1) and A/D is the chosen option.
    """
    clear_screen()
    print("--- Analyze Raw Answers (Manual Input) ---")
    print("Enter answers in the format 'QuestionNumber: OptionLetter'.")
    print("E.g., '1: A' for Question 1, Option A.")
    print("Type 'DONE' on a new line to finish input.")
    print("------------------------------------------")

    manual_answers = {} # Stores {question_index: chosen_option_letter}
    num_questions = len(ALL_QUESTIONS)

    while True:
        line = input("Enter answer or 'DONE': ").strip()
        if line.upper() == 'DONE':
            break
        
        match = re.match(r'(\d+):\s*([A-Da-d])', line) # Match number: letter (A-D)
        if match:
            q_num = int(match.group(1))
            option_letter = match.group(2).upper()
            
            q_idx = q_num - 1 # Convert to 0-based index
            
            if 0 <= q_idx < num_questions:
                # Validate if the option letter is actually valid for this question
                question_data = ALL_QUESTIONS[q_idx]
                if option_letter in question_data["options"]:
                    manual_answers[q_idx] = option_letter
                    print(f"Added: Question {q_num}, Option {option_letter}")
                else:
                    print(f"Invalid option '{option_letter}' for Question {q_num}.")
            else:
                print(f"Invalid question number: {q_num}. Max questions: {num_questions}.")
        else:
            print("Invalid format. Please use 'QuestionNumber: OptionLetter' (e.g., '1: A').")
    
    if manual_answers:
        print("\nAnalyzing manually entered answers...")
        animated_progress_bar()
        mi_type_result, _ = calculate_mi_type(manual_answers) # Get profile and discard scores
        display_mi_type_results_paginated(mi_type_result, manual_answers)
    else:
        print("No valid answers entered for analysis.")
    input("Press Enter to continue...")


def analyze_raw_answers_from_file_option():
    """
    Allows loading raw answers from a .txt file for analysis.
    Assumes file format: "Question N: Option X" or "N: X"
    """
    clear_screen()
    print("--- Analyze Raw Answers from File ---")
    filename = input("Enter filename of raw answers (e.g., my_answers.txt): ").strip()
    if not filename:
        print("Analysis from file cancelled.")
        input("Press Enter to continue...")
        return

    file_path = os.path.join(SAVES_DIR, filename)
    if not os.path.exists(file_path):
        print(f"Error: File '{file_path}' not found.")
        input("Press Enter to continue...")
        return
    
    file_answers = {}
    num_questions = len(ALL_QUESTIONS)
    
    try:
        with open(file_path, 'r') as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                
                # Regex to match formats like "Question N: X" or "N: X"
                match = re.match(r'(?:Question\s*)?(\d+):\s*([A-Da-d])', line, re.IGNORECASE)
                if match:
                    q_num = int(match.group(1))
                    option_letter = match.group(2).upper()
                    
                    q_idx = q_num - 1 # Convert to 0-based index

                    if 0 <= q_idx < num_questions:
                        question_data = ALL_QUESTIONS[q_idx]
                        if option_letter in question_data["options"]:
                            file_answers[q_idx] = option_letter
                        else:
                            print(f"Warning: Invalid option '{option_letter}' for Question {q_num} in file line: '{line}'. Skipping.")
                    else:
                        print(f"Warning: Invalid question number {q_num} in file line: '{line}'. Skipping.")
                else:
                    print(f"Warning: Skipping malformed line in file: '{line}' (expected 'N: X' or 'Question N: X').")
        
        if file_answers:
            print("\nAnalyzing answers from file...")
            animated_progress_bar()
            mi_type_result, _ = calculate_mi_type(file_answers)
            display_mi_type_results_paginated(mi_type_result, file_answers)
        else:
            print("No valid answers found in the file.")

    except IOError as e:
        print(f"\nError reading file: {e}")
    input("Press Enter to continue...")


def display_single_profile_details(profile_name):
    """
    Displays the full details of a single Mi Type profile.
    """
    profile = get_profile(profile_name)
    if not profile:
        clear_screen()
        print(f"Error: Profile '{profile_name}' not found.")
        input("Press Enter to continue...")
        return

    pages = []

    # Page 1: Overview
    page1 = [
        f"--- Mi Type Profile: {profile.get('name', 'N/A')} ---",
        "",
        "Overview:",
        f"{profile.get('overview', 'No overview available.')}",
        "",
        "--- Page 1/3 ---"
    ]
    pages.append(page1)

    # Page 2: Strengths & Egotends
    page2 = [
        f"--- Mi Type Profile: {profile.get('name', 'N/A')} ---",
        "",
        "Strengths:",
        *[f"- {s}" for s in profile.get('strengths', ['No strengths listed.'])],
        "",
        "Egotends (Potential Challenges):",
        *[f"- {e}" for e in profile.get('egotends', ['No egotends listed.'])],
        "",
        "--- Page 2/3 ---"
    ]
    pages.append(page2)

    # Page 3: Highertends & Change Threshold
    page3 = [
        f"--- Mi Type Profile: {profile.get('name', 'N/A')} ---",
        "",
        "Highertends (Growth Path):",
        *[f"- {h}" for h in profile.get('highertends', ['No highertends listed.'])],
        "",
        f"Change Threshold: {profile.get('change_threshold', 'N/A')}",
        "",
        "--- Page 3/3 ---",
        "",
        "Options:",
        "N: Next Page, P: Previous Page, M: Back to Profiles Menu"
    ]
    pages.append(page3)

    current_page_index = 0
    while True:
        clear_screen()
        for line in pages[current_page_index]:
            print(line)

        choice = get_single_char_input("\nAction (N/P/M): ").strip().upper()

        if choice == 'N':
            current_page_index = (current_page_index + 1) % len(pages)
        elif choice == 'P':
            current_page_index = (current_page_index - 1 + len(pages)) % len(pages)
        elif choice == 'M':
            break
        else:
            print("Invalid input. Please use 'N', 'P', or 'M'.")
            time.sleep(1)


def main_app():
    """Main function to run the interactive menu and application."""
    # This print statement confirms which version of the script is running
    print("--- Mi Type Assessment Application (Version 1.0.3 - 2025-05-27) ---")

    last_session_answers = None

    # Print current working directory for debugging purposes
    print(f"Current working directory: {os.getcwd()}")
    print("Resizing your terminal for the best experience might be helpful.")
    print("Press Ctrl+C to stop the animation.")
    time.sleep(2) # Give a moment to read the message
    run_animation_and_text(text_display_duration=3, ripple_duration=5, fps=20, sparkle_factor=0.3, sparkle_frame_interval=5)

    # Initial clear and display of menu
    clear_screen() # Clear screen after animation
    display_main_menu()

    while True:
        choice = get_single_char_input("Enter your choice (1-8): ").strip()

        if choice == '1':
            run_assessment_quiz_result = run_assessment_quiz()
            if run_assessment_quiz_result is not None:
                last_session_answers = run_assessment_quiz_result
            clear_screen() # Clear before showing main menu again
            display_main_menu() # Re-display menu after action
        elif choice == '2':
            view_profiles_menu()
            clear_screen() # Clear before showing main menu again
            display_main_menu() # Re-display menu after action
        elif choice == '3':
            explain_egotends_highertends()
            clear_screen() # Clear before showing main menu again
            display_main_menu() # Re-display menu after action
        elif choice == '4':
            loaded_answers, loaded_index = load_progress()
            if loaded_answers is not None:
                run_assessment_quiz_result = run_assessment_quiz(loaded_answers, loaded_index)
                if run_assessment_quiz_result is not None:
                    last_session_answers = run_assessment_quiz_result
            clear_screen() # Clear before showing main menu again
            display_main_menu() # Re-display menu after action
        elif choice == '5':
            export_raw_answers_menu_option(last_session_answers)
            clear_screen() # Clear before showing main menu again
            display_main_menu() # Re-display menu after action
        elif choice == '6':
            analyze_raw_answers_manual_option()
            clear_screen() # Clear before showing main menu again
            display_main_menu() # Re-display menu after action
        elif choice == '7':
            analyze_raw_answers_from_file_option()
            clear_screen() # Clear before showing main menu again
            display_main_menu() # Re-display menu after action
        elif choice == '8':
            clear_screen()
            print("Thank you for using the Mi Type Assessment. Goodbye!")
            sys.exit()
        else:
            print("Invalid choice. Please enter a number between 1 and 8.")
            input("Press Enter to continue...")
            clear_screen() # Clear after error message pause
            display_main_menu() # Re-display menu after error

if __name__ == '__main__':
    main_app()