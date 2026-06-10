import json
import os
import os.path

def mi_type_assessment():
    """
    Conducts the Mi Type Assessment with an interactive menu and Mi Type analysis.
    """

    def clear_screen():
        """Clears the console screen."""
        os.system('cls' if os.name == 'nt' else 'clear')

    def display_menu():
        """Displays the main menu."""
        clear_screen()
        print("\n--- Mi Type Assessment Menu ---")
        print("1. Take Test One")
        print("2. Take Test Two")
        print("3. View Results")
        print("4. Load Previous Results")
        print("5. Save and Exit")
        print("6. Exit without Saving")
        print("-----------------------------")

    def take_test(test_number, questions, answers_list, options):
        """Conducts a single test (Test One or Test Two)."""

        for i, question in enumerate(questions):
            clear_screen()
            print(f"\n--- Test {test_number} - Question {i + 1} of {len(questions)} ---")
            print(question)
            while True:
                answer = input(f"Your answer ({', '.join(options)}): ").lower() if test_number == 2 else input(f"Your answer ({', '.join(options)}): ").upper()
                if answer in options:
                    answers_list.append(answer)
                    break
                else:
                    print(f"Invalid input. Please enter {', '.join(options)}.")

    def save_results(test_one_answers, test_two_answers):
        """Saves the test results to a JSON file."""

        filename = input("Enter a filename to save your results (e.g., results.json): ")
        results = {
            "Test One Answers": test_one_answers,
            "Test Two Answers": test_two_answers,
        }
        try:
            with open(filename, "w") as f:
                json.dump(results, f, indent=4)
            print(f"Results saved to {filename}")
            return True
        except Exception as e:
            print(f"Error saving results: {e}")
            return False

    def load_results(filename):
        """Loads results from a JSON file."""

        try:
            with open(filename, "r") as f:
                results = json.load(f)
            return results.get("Test One Answers", []), results.get("Test Two Answers", [])
        except FileNotFoundError:
            print(f"Error: File '{filename}' not found.")
            return [], []
        except json.JSONDecodeError:
            print(f"Error: Invalid JSON format in '{filename}'.")
            return [], []

    def view_results(test_one_answers, test_two_answers):
        """Displays the test answers and Mi Type result."""

        clear_screen()
        print("\n--- Your Assessment Results ---")

        if test_one_answers:
            print("\nTest One Answers:", "".join(test_one_answers))  # Display as a single string
        else:
            print("\nTest One: Not taken.")

        if test_two_answers:
            print("\nTest Two Answers:", "".join(test_two_answers))  # Display as a single string
        else:
            print("\nTest Two: Not taken.")

        if test_one_answers or test_two_answers:
            mi_type = analyze_mi_type(test_one_answers, test_two_answers)
            print(f"\nYour likely Mi Type: {mi_type}")
        else:
            print("\nNo tests taken yet. Please complete the tests to get your Mi Type.")

        input("\nPress Enter to return to the main menu...")  # Pause to view results

    # --- Mi Type Analysis ---
    def analyze_mi_type(test_one_answers, test_two_answers):
        """
        Analyzes the test results to determine the most likely Mi Type.
        This is a simplified example and needs to be replaced with a robust algorithm.
        """

        # --- Scoring Weights (Example - REPLACE WITH YOUR ACTUAL WEIGHTS) ---
        weights_test_one = {
            "A": {"Logical": 0.8, "Organized": 0.2, "Empathetic": 0.1, "Intuitive": 0.5},
            "B": {"Logical": 0.2, "Organized": 0.8, "Empathetic": 0.5, "Intuitive": 0.1},
            "C": {"Logical": 0.1, "Organized": 0.5, "Empathetic": 0.8, "Intuitive": 0.2},
            "D": {"Logical": 0.5, "Organized": 0.1, "Empathetic": 0.2, "Intuitive": 0.8},
        }

        weights_test_two = {
            "a": {"Extroversion": 0.7, "Sensing": 0.3, "Thinking": 0.6, "Judging": 0.4},
            "b": {"Extroversion": -0.7, "Sensing": 0.3, "Thinking": -0.6, "Judging": 0.4},
            "c": {"Extroversion": -0.3, "Sensing": -0.7, "Thinking": -0.4, "Judging": -0.6},
            "d": {"Extroversion": 0.3, "Sensing": -0.7, "Thinking": 0.4, "Judging": 0.6},
        }

        # --- Calculate Scores ---
        scores_test_one = {
            "Logical": 0, "Organized": 0, "Empathetic": 0, "Intuitive": 0
        }
        if test_one_answers:
            for answer in test_one_answers:
                for key in scores_test_one:
                    scores_test_one[key] += weights_test_one[answer][key]

        scores_test_two = {
            "Extroversion": 0, "Sensing": 0, "Thinking": 0, "Judging": 0
        }
        if test_two_answers:
            for answer in test_two_answers:
                for key in scores_test_two:
                    scores_test_two[key] += weights_test_two[answer][key]

        # --- Mi Type Assignment Rules (Example - REPLACE WITH YOUR LOGIC) ---
        mi_types = {
            "Adaptive Analyst": {"Logical": 0.7, "Organized": 0.5, "Empathetic": 0.4, "Intuitive": 0.4},
            "Collaborative Team Player": {"Empathetic": 0.8, "Organized": 0.6, "Logical": 0.3, "Intuitive": 0.3, "Extroversion": 0.6, "Thinking": 0.4, "Judging": 0.5},
            "Creative Problem Solver": {"Intuitive": 0.7, "Logical": 0.5, "Empathetic": 0.4, "Organized": 0.4, "Extroversion": 0.4, "Thinking": 0.5, "Judging": 0.5},
            "Detailed Organizer": {"Organized": 0.8, "Logical": 0.5, "Empathetic": 0.3, "Intuitive": 0.2, "Extroversion": 0.3, "Thinking": 0.5, "Judging": 0.7},
            "Dynamic Motivator": {"Intuitive": 0.6, "Empathetic": 0.6, "Logical": 0.4, "Organized": 0.4, "Extroversion": 0.8, "Thinking": 0.4, "Judging": 0.5},
            "Efficient Analyst": {"Logical": 0.8, "Organized": 0.7, "Empathetic": 0.2, "Intuitive": 0.3, "Extroversion": 0.4, "Thinking": 0.7, "Judging": 0.6},
            "Empathetic Supporter": {"Empathetic": 0.9, "Organized": 0.4, "Logical": 0.2, "Intuitive": 0.3, "Extroversion": 0.6, "Thinking": 0.3, "Judging": 0.4},
            "Expressive Communicator": {"Empathetic": 0.7, "Intuitive": 0.6, "Logical": 0.3, "Organized": 0.3, "Extroversion": 0.7, "Thinking": 0.4, "Judging": 0.4},
            "Harmonious Facilitator": {"Empathetic": 0.8, "Organized": 0.6, "Logical": 0.3, "Intuitive": 0.3, "Extroversion": 0.5, "Thinking": 0.4, "Judging": 0.6},
            "Holistic Integrator": {"Empathetic": 0.6, "Intuitive": 0.6, "Logical": 0.4, "Organized": 0.4, "Extroversion": 0.5, "Thinking": 0.4, "Judging": 0.5},
            "Imaginative Explorer": {"Intuitive": 0.9, "Empathetic": 0.4, "Logical": 0.2, "Organized": 0.5, "Extroversion": 0.6, "Thinking": 0.4, "Judging": 0.4},
            "Innovative Designer": {"Intuitive": 0.7, "Organized": 0.5, "Logical": 0.3, "Empathetic": 0.5, "Extroversion": 0.5, "Thinking": 0.5, "Judging": 0.5},
            "Intuitive Strategist": {"Logical": 0.5, "Intuitive": 0.7, "Organized": 0.3, "Empathetic": 0.4, "Extroversion": 0.5, "Thinking": 0.5, "Judging": 0.5},
            "Logical Innovator": {"Logical": 0.7, "Intuitive": 0.6, "Organized": 0.3, "Empathetic": 0.2, "Extroversion": 0.4, "Thinking": 0.7, "Judging": 0.6},
            "Methodical Producer": {"Organized": 0.7, "Logical": 0.7, "Empathetic": 0.3, "Intuitive": 0.3, "Extroversion": 0.4, "Thinking": 0.6, "Judging": 0.7},
            "Passionate Advocate": {"Empathetic": 0.7, "Intuitive": 0.6, "Logical": 0.4, "Organized": 0.3, "Extroversion": 0.6, "Thinking": 0.4, "Judging": 0.4},
            "Personalized Coach": {"Empathetic": 0.8, "Intuitive": 0.5, "Logical": 0.2, "Organized": 0.5, "Extroversion": 0.7, "Thinking": 0.3, "Judging": 0.4},
            "Relationship Builder": {"Empathetic": 0.9, "Intuitive": 0.3, "Logical": 0.1, "Organized": 0.7, "Extroversion": 0.8, "Thinking": 0.2, "Judging": 0.6},
            "Reliable Executor": {"Organized": 0.7, "Logical": 0.6, "Empathetic": 0.5, "Intuitive": 0.2, "Extroversion": 0.3, "Thinking": 0.6, "Judging": 0.7},
            "Strategic Planner": {"Logical": 0.6, "Organized": 0.7, "Empathetic": 0.3, "Intuitive": 0.4, "Extroversion": 0.4, "Thinking": 0.6, "Judging": 0.7},
            "Structured Communicator": {"Organized": 0.7, "Empathetic": 0.6, "Logical": 0.4, "Intuitive": 0.3, "Extroversion": 0.5, "Thinking": 0.5, "Judging": 0.6},
            "Systematic Implementer": {"Logical": 0.4, "Organized": 0.8, "Empathetic": 0.4, "Intuitive": 0.2, "Extroversion": 0.3, "Thinking": 0.6, "Judging": 0.7},
            "Transformational Leader": {"Logical": 0.6, "Intuitive": 0.6, "Empathetic": 0.6, "Organized": 0.2, "Extroversion": 0.7, "Thinking": 0.6, "Judging": 0.5},
            "Visionary Conceptualizer": {"Intuitive": 0.8, "Logical": 0.6, "Organized": 0.2, "Empathetic": 0.2, "Extroversion": 0.6, "Thinking": 0.6, "Judging": 0.4},
        }

        # Normalize the scores
        scores_test_one_normalized = {}
        if test_one_answers:
            for key in scores_test_one:
                scores_test_one_normalized[key] = scores_test_one[key] / len(test_one_answers)  # Normalize to 0-1 range (approx.)
        else:
            scores_test_one_normalized = {key: 0 for key in scores_test_one} # Initialize to 0 if no test

        scores_test_two_normalized = {}
        if test_two_answers:
            for key in scores_test_two:
                scores_test_two_normalized[key] = scores_test_two[key] / len(test_two_answers)
        else:
            scores_test_two_normalized = {key: 0 for key in scores_test_two}

        # Combine scores from both tests (simple average for now)
        combined_scores = {}
        for key in scores_test_one_normalized:
            combined_scores[key] = (scores_test_one_normalized.get(key, 0) + scores_test_two_normalized.get(key, 0)) / (1 + (1 if test_two_answers else 0))

        # Determine Mi Type
        best_match = "Undetermined"
        best_match_score = -1  # Initialize with a very low score
        for mi_type, profile in mi_types.items():
            score = 0
            for key in combined_scores:
                score += profile.get(key, 0) * combined_scores.get(key, 0)  # Weighted sum
            if score > best_match_score:
                best_match = mi_type
                best_match_score = score

        return best_match

    # --- Original Test One Questions ---
    test_one_questions = [
        "1.  When learning something new, I prefer to:\n    A) Understand the underlying principles and theories.\n    B) See practical examples and applications.\n    C) Work with others and discuss ideas.\n    D) Experiment and try things on my own.",
        "2.  When faced with a problem, I tend to:\n    A) Analyze the situation logically.\n    B) Gather all the necessary information and create a plan.\n    C) Consider the impact on others and seek input.\n    D) Brainstorm creative solutions and explore possibilities.",
        "3.  In a group setting, I am most likely to:\n    A) Offer a critical analysis or a different perspective.\n    B) Keep the group focused on the task.\n    C) Facilitate discussion and ensure everyone feels heard.\n    D) Generate new ideas and connect concepts.",
        "4.  When making a decision, I usually rely on:\n    A) Facts, logic, and objective data.\n    B) Proven methods and established procedures.\n    C) My intuition and gut feelings.\n    D) A combination of logic, intuition, and the needs of those involved.",
        "5.  I am most motivated by:\n    A) A challenge that requires me to think critically.\n    B) A clear set of goals and a well-defined plan.\n    C) An opportunity to collaborate and help others.\n    D) A chance to be creative and innovative.",
        "6.  I prefer to work in an environment that is:\n    A) Structured and organized.\n    B) Flexible and allows for autonomy.\n    C) Supportive and collaborative.\n    D) Stimulating and intellectually challenging.",
        "7.  When communicating with others, I tend to:\n    A) Be direct and to the point.\n    B) Provide detailed and specific information.\n    C) Focus on building rapport and establishing common ground.\n    D) Use metaphors and analogies to explain my ideas.",
        "8.  I am most comfortable with:\n    A) Analyzing data and solving complex problems.\n    B) Following procedures and completing tasks efficiently.\n    C) Interacting with people and understanding their emotions.\n    D) Exploring new ideas and generating creative solutions.",
        "9.  I learn best by:\n    A) Reading, listening to lectures, and conducting research.\n    B) Practicing and applying knowledge in real-world situations.\n    C) Discussing and debating ideas with others.\n    D) Experimenting and trying things out for myself.",
        "10. When faced with a conflict, I tend to:\n    A) Remain objective and focus on finding a logical solution.\n    B) Follow established rules and procedures.\n    C) Try to understand everyone's perspective and find a compromise.\n    D) Look for creative solutions that address everyone's needs.",
        "11. I am drawn to:\n    A) Intellectual pursuits and academic challenges.\n    B) Practical tasks and hands-on activities.\n    C) Social causes and helping others.\n    D) Artistic expression and creative endeavors.",
        "12. I value:\n    A) Competence and expertise.\n    B) Efficiency and productivity.\n    C) Compassion and empathy.\n    D) Innovation and originality.",
        "13. I feel most energized when:\n    A) I am learning something new and challenging.\n    B) I am completing tasks and achieving goals.\n    C) I am connecting with others and building relationships.\n    D) I am expressing my creativity and exploring new ideas.",
        "14. I am most stressed by:\n    A) Lack of intellectual stimulation.\n    B) Disorganization and chaos.\n    C) Conflict and interpersonal tension.\n    D) Routine and lack of creative freedom.",
        "15. I believe that:\n    A) Logic and reason should guide decision-making.\n    B) Rules and procedures are essential for maintaining order.\n    C) People's feelings and needs should be taken into consideration.\n    D) Intuition and creativity are valuable assets.",
        "16. I am good at:\n    A) Analyzing information and identifying patterns.\n    B) Organizing and managing details.\n    C) Communicating effectively and building rapport.\n    D) Generating new ideas and seeing the big picture.",
        "17. I prefer to spend my free time:\n    A) Learning new things and expanding my knowledge.\n    B) Engaging in practical activities or hobbies.\n    C) Spending time with loved ones and socializing.\n    D) Pursuing creative interests or exploring new experiences.",
        "18. I am most fulfilled when I am able to:\n    A) Contribute to intellectual discourse and advance knowledge.\n    B) Create efficient systems and improve processes.\n    C) Make a positive impact on people's lives.\n    D) Express my creativity and inspire others.",
        "19. I am drawn to careers that involve:\n    A) Research, analysis, and problem-solving.\n    B) Organization, planning, and management.\n    C) Helping, teaching, or counseling others.\n    D) Innovation, design, and creative expression.",
        "20. I believe that the world needs more:\n    A) Critical thinkers and innovators.\n    B) Practical solutions and efficient systems.\n    C) Compassion and understanding.\n    D) Creativity and imagination.",
    ]

    # --- Original Test Two Questions ---
    test_two_questions = [
        "1.  In social situations, I generally:\n    a) Prefer to be in the spotlight, initiating conversations.\n    b) Enjoy interacting with a small group of close friends.\n    c) Observe and listen more than I actively participate.\n    d) Feel comfortable in both large and small groups.",
        "2.  When faced with a new task, I usually:\n    a) Dive right in and learn as I go.\n    b) Plan and organize my approach before starting.\n    c) Seek guidance or instructions from others.\n    d) Feel energized by the challenge and newness.",
        "3.  When making decisions, I tend to:\n    a) Rely on my gut feeling and intuition.\n    b) Analyze the situation logically and weigh the pros and cons.\n    c) Consider the impact on others and their feelings.\n    d) Seek a balance between logic, intuition, and the needs of those involved.",
        "4.  I am most motivated by:\n    a) Achieving personal goals and recognition.\n    b) Maintaining stability and security.\n    c) Helping others and making a positive impact.\n    d) Exploring new ideas and experiences.",
        "5.  I prefer to work in an environment that is:\n    a) Fast-paced and dynamic with opportunities for growth.\n    b) Structured and predictable with clear expectations.\n    c) Supportive and collaborative with a strong team spirit.\n    d) Flexible and allows for autonomy and creativity.",
        "6.  When expressing my opinions, I am usually:\n    a) Assertive and direct.\n    b) Tactful and diplomatic.\n    c) Hesitant and cautious.\n    d) Open and willing to consider different perspectives.",
        "7.  I handle stress by:\n    a) Taking action and finding solutions.\n    b) Sticking to routines and familiar activities.\n    c) Seeking support from friends and family.\n    d) Engaging in creative outlets or solitary activities.",
        "8.  I am most drawn to:\n    a) Competition and challenges.\n    b) Tradition and established practices.\n    c) Harmony and cooperation.\n    d) Novelty and change.",
        "9.  I value:\n    a) Efficiency and productivity.\n    b) Loyalty and commitment.\n    c) Compassion and understanding.\n    d) Creativity and innovation.",
        "10. I feel most energized when:\n    a) I am leading a project or taking charge.\n    b) I am completing tasks and achieving goals.\n    c) I am connecting with others and building relationships.\n    d) I am expressing my creativity and exploring new ideas.",
        "11. I am most comfortable with:\n    a) Taking risks and embracing new challenges.\n    b) Following established procedures and routines.\n    c) Maintaining harmony and avoiding conflict.\n    d) Adapting to change and exploring different possibilities.",
        "12. I learn best by:\n    a) Doing and experimenting.\n    b) Observing and analyzing.\n    c) Discussing and collaborating with others.\n    d) A combination of different learning styles.",
        "13. When faced with a conflict, I tend to:\n    a) Take charge and assert my perspective.\n    b) Seek a compromise or mediate the situation.\n    c) Avoid confrontation or withdraw from the situation.\n    d) Analyze the situation objectively and find a logical solution.",
        "14. I am drawn to careers that involve:\n    a) Leadership and decision-making.\n    b) Structure and stability.\n    c) Helping and supporting others.\n    d) Creativity and innovation.",
        "15. I believe that the world needs more:\n    a) Ambition and drive.\n    b) Order and stability.\n    c) Compassion and understanding.\n    d) Creativity and imagination.",
        "16. I prefer to spend my free time:\n    a) Engaging in exciting and adventurous activities.\n    b) Relaxing at home or pursuing familiar hobbies.\n    c) Spending time with loved ones and socializing.\n    d) Exploring new interests and learning new things.",
        "17. I am most fulfilled when I am able to:\n    a) Achieve success and recognition.\n    b) Provide security and stability for myself and others.\n    c) Make a positive impact on people's lives.\n    d) Express my creativity and explore new possibilities.",
        "18. I am drawn to people who are:\n    a) Confident and assertive.\n    b) Reliable and dependable.\n    c) Kind and compassionate.\n    d) Creative and open-minded.",
        "19. I believe that:\n    a) Taking risks is essential for growth.\n    b) Following rules and traditions is important.\n    c) Maintaining strong relationships is crucial.\n    d) Embracing change and adapting is necessary.",
        "20. I am good at:\n    a) Taking initiative and leading others.\n    b) Organizing and managing tasks effectively.\n    c) Understanding and empathizing with others.\n    d) Generating new ideas and finding creative solutions.",
    ]

    test_one_answers = []
    test_two_answers = []
    loaded_results = {} # Dictionary to store loaded results

    # --- Main Loop ---
    while True:
        display_menu()
        choice = input("Enter your choice: ")

        if choice == "1":
            take_test(1, test_one_questions, test_one_answers, ('A', 'B', 'C', 'D'))
        elif choice == "2":
            take_test(2, test_two_questions, test_two_answers, ('a', 'b', 'c', 'd'))
        elif choice == "3":
            view_results(test_one_answers, test_two_answers)
        elif choice == "4":
            filename = input("Enter the filename to load results from (e.g., results.json): ")
            loaded_results["Test One Answers"], loaded_results["Test Two Answers"] = load_results(filename)
            if loaded_results["Test One Answers"] or loaded_results["Test Two Answers"]:
                view_results(loaded_results["Test One Answers"], loaded_results["Test Two Answers"])
            else:
                print("No results loaded.")
        elif choice == "5":
            if save_results(test_one_answers, test_two_answers):
                break
        elif choice == "6":
            print("Exiting without saving.")
            break
        else:
            print("Invalid choice. Please try again.")

if __name__ == "__main__":
    mi_type_assessment()