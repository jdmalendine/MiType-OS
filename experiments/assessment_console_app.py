# assessment_console_app.py
import os
import sys

# Import your questions
from mi_type_assessments import ALL_QUESTIONS, HBDI_QUESTIONS, MBTI_QUESTIONS
# Import your Mi Type profiles
from mi_type_profiles import MI_TYPE_PROFILES, get_profile

def clear_screen():
    """Clears the terminal screen."""
    # For Windows
    if os.name == 'nt':
        _ = os.system('cls')
    # For macOS and Linux
    else:
        _ = os.system('clear')

def display_question(q_index, user_answers):
    """Displays a single question and its options."""
    clear_screen()

    if not (0 <= q_index < len(ALL_QUESTIONS)):
        print("Error: Invalid question index.")
        return

    question_data = ALL_QUESTIONS[q_index]
    question_number = q_index + 1
    total_questions = len(ALL_QUESTIONS)

    print(f"--- Mi Type Assessment --- (Question {question_number} of {total_questions})\n")
    print(f"Q{question_number}: {question_data['question']}\n")

    options_list = list(question_data['options'].items())
    for key, text in options_list:
        # Check if this option was previously selected
        selected_indicator = " (Selected)" if user_answers.get(q_index) == key else ""
        print(f"  {key}) {text}{selected_indicator}")

    print("\n-----------------------------------------------------")
    print("Type your answer (e.g., A, B, C, D).")
    print("Type 'back' to go to the previous question.")
    print("Type 'quit' to exit the assessment.")
    print("-----------------------------------------------------")


def calculate_mi_type_profile(user_answers):
    """
    Calculates the user's Mi Type profile based on their answers using a closest-match approach.
    """
    # Initialize scores
    hbdi_scores = {"A": 0, "B": 0, "C": 0, "D": 0}
    mbti_scores = {"E": 0, "I": 0, "S": 0, "N": 0, "T": 0, "F": 0, "J": 0, "P": 0}

    # Process HBDI questions (first 20 questions)
    for i in range(len(HBDI_QUESTIONS)):
        selected_option = user_answers.get(i)
        if selected_option and "score_map" in HBDI_QUESTIONS[i]:
            scores_for_option = HBDI_QUESTIONS[i]["score_map"].get(selected_option)
            if scores_for_option:
                for axis, value in scores_for_option.items():
                    hbdi_scores[axis[-1].upper()] += value # hbdi_a -> A, hbdi_b -> B etc.

    # Process MBTI questions (questions from index 20 to end)
    for i in range(len(HBDI_QUESTIONS), len(ALL_QUESTIONS)):
        selected_option = user_answers.get(i)
        if selected_option and "score_map" in ALL_QUESTIONS[i]: # Use ALL_QUESTIONS as index 'i' maps to it
            scores_for_option = ALL_QUESTIONS[i]["score_map"].get(selected_option)
            if scores_for_option:
                for axis, value in scores_for_option.items():
                    mbti_scores[axis[-1].upper()] += value # mbti_e -> E, mbti_i -> I etc.

    # --- Determine user's HBDI preference order (top N dominant, sorted) ---
    # Get all HBDI quadrants sorted by score descending
    sorted_user_hbdi = sorted(hbdi_scores.items(), key=lambda item: item[1], reverse=True)
    
    user_hbdi_preference_order = []
    if sorted_user_hbdi:
        # Include all quadrants that are tied for the highest score
        max_score = sorted_user_hbdi[0][1]
        for archetype, score in sorted_user_hbdi:
            if score == max_score:
                user_hbdi_preference_order.append(archetype)
            else:
                break # Stop if scores drop

        # Then, if there's a clear second tier (or more), include them too, up to a sensible limit (e.g., top 3)
        # This makes the HBDI comparison more flexible than just strict top 2.
        if len(user_hbdi_preference_order) < 4: # If not all quadrants are tied for max
            next_tier_start_index = len(user_hbdi_preference_order)
            if next_tier_start_index < len(sorted_user_hbdi):
                second_max_score = sorted_user_hbdi[next_tier_start_index][1]
                for i in range(next_tier_start_index, len(sorted_user_hbdi)):
                    if sorted_user_hbdi[i][1] == second_max_score and len(user_hbdi_preference_order) < 3: # Limit to top 3 for comparison if possible
                        user_hbdi_preference_order.append(sorted_user_hbdi[i][0])
                    else:
                        break
    user_hbdi_preference_order = sorted(list(set(user_hbdi_preference_order))) # Remove duplicates and sort for consistent comparison

    # --- Determine user's 4-letter MBTI type ---
    user_mbti_type = ""
    user_mbti_type += "E" if mbti_scores["E"] >= mbti_scores["I"] else "I"
    user_mbti_type += "S" if mbti_scores["S"] >= mbti_scores["N"] else "N"
    user_mbti_type += "T" if mbti_scores["T"] >= mbti_scores["F"] else "F"
    user_mbti_type += "J" if mbti_scores["J"] >= mbti_scores["P"] else "P"


    # --- Find the Closest Matching Mi Type Profile ---
    best_match_profile_name = None
    highest_similarity_score = -1

    for profile_name, profile_data in MI_TYPE_PROFILES.items():
        profile_hbdi_archetype = sorted(profile_data['hbdi_archetype']) # Ensure sorted for consistent comparison
        profile_mbti_archetype = profile_data['mbti_archetype'] # This is a list like ["N", "P", "E"]

        current_profile_similarity_score = 0

        # HBDI Similarity Score: Count how many of the profile's HBDI archetypes are present in user's top HBDI preferences
        # Giving priority to the profile's explicit archetypes
        for hbdi_char_in_profile in profile_hbdi_archetype:
            if hbdi_char_in_profile in user_hbdi_preference_order:
                current_profile_similarity_score += 1 # Add 1 for each direct match

        # MBTI Similarity Score: Count how many letters from user's 4-letter MBTI are in profile's MBTI archetype
        # This assumes profile_mbti_archetype are the dominant letters for that profile
        for mbti_char_in_user_type in user_mbti_type:
            if mbti_char_in_user_type in profile_mbti_archetype:
                current_profile_similarity_score += 1

        # Check if this profile is a better match
        if current_profile_similarity_score > highest_similarity_score:
            highest_similarity_score = current_profile_similarity_score
            best_match_profile_name = profile_name

    # Fallback if no specific match is found (shouldn't happen with at least one match)
    if best_match_profile_name is None:
        return "No Suitable Profile Found" # Fallback if no profile exists or no scores accumulated

    return best_match_profile_name


def run_assessment():
    """Runs the interactive console assessment."""
    current_q_index = 0
    user_answers = {} # Stores {question_index: selected_option_key}

    while True:
        display_question(current_q_index, user_answers)

        user_input = input("\nYour choice: ").strip().lower()

        if user_input == 'quit':
            print("\nExiting assessment. Goodbye!")
            break
        elif user_input == 'back':
            if current_q_index > 0:
                current_q_index -= 1
            else:
                print("You are on the first question. Cannot go back further.")
                input("Press Enter to continue...") # Pause to read message
            continue # Loop again to display current question
        elif user_input in ['a', 'b', 'c', 'd']:
            # Validate if the option key exists for the current question
            if user_input.upper() in ALL_QUESTIONS[current_q_index]['options']:
                user_answers[current_q_index] = user_input.upper()

                if current_q_index < len(ALL_QUESTIONS) - 1:
                    current_q_index += 1 # Move to next question
                else:
                    # End of quiz - calculate and display results
                    clear_screen()
                    print("--- Assessment Complete! ---")
                    
                    profile_name = calculate_mi_type_profile(user_answers)
                    
                    matched_profile = get_profile(profile_name) # Fetch the full profile data

                    if matched_profile:
                        print(f"\nYour Mi Type Profile: {profile_name}")
                        print(f"\nOverview: {matched_profile['overview']}")
                        print(f"\nStrengths: {', '.join(matched_profile['strengths'])}")
                        
                        print("\nEgo Tendencies:")
                        for tend in matched_profile['egotends']:
                            print(f"  - {tend}")
                            
                        print("\nHigher Tendencies:")
                        for tend in matched_profile['highertends']:
                            print(f"  - {tend}")
                            
                        print(f"\nChange Threshold: {matched_profile['change_threshold']}")
                        # We are no longer displaying raw scores or internal calculated types directly
                        # print(f"\nHBDI Archetype (Profile): {matched_profile['hbdi_archetype']}")
                        # print(f"MBTI Archetype (Profile): {matched_profile['mbti_archetype']}")
                    else:
                        # This should ideally not happen with the closest match logic,
                        # unless MI_TYPE_PROFILES is empty or profile_name is "No Suitable Profile Found"
                        print(f"\nAn error occurred: Could not find a suitable Mi Type profile.")
                    
                    print("\n--- End of Assessment ---")
                    input("Press Enter to exit...")
                    break # Exit the loop after showing results
            else:
                print("Invalid option for this question. Please try again.")
                input("Press Enter to continue...") # Pause to read message
        else:
            print("Invalid input. Please type A, B, C, D, 'back', or 'quit'.")
            input("Press Enter to continue...") # Pause to read message

if __name__ == '__main__':
    run_assessment()