from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.label import Label
from kivy.uix.textinput import TextInput
from kivy.uix.button import Button
from kivy.uix.screenmanager import ScreenManager, Screen
from kivy.uix.togglebutton import ToggleButton
from kivy.graphics import Color, Rectangle
from kivy.uix.popup import Popup
from kivy.uix.filechooser import FileChooserListView
import json
import os
from datetime import datetime
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG, filename='/Users/Jordaniel/.kivy/logs/debug_25-07-18.log')
logger = logging.getLogger(__name__)

# Color Scheme
PRIMARY_COLOR = (0.12, 0.56, 1.0, 1.0)  # Dodger Blue
BACKGROUND_COLOR = (0.50, 0.0, 0.50, 1.0)  # Purple
ACCENT_COLOR = (1.0, 0.41, 0.71, 1.0)  # Hot Pink

# Full 40 Unique MiType+ Test Questions
MITYPE_QUESTIONS = [
    "1. If I'm learning something new, I start by: A) Understanding facts. B) Reading instructions. C) Talking to others. D) Experimenting.",
    "2. When solving problems, I prefer: A) Logical steps. B) Practical experience. C) Group discussion. D) Creative trials.",
    "3. I am most comfortable in: A) Structured settings. B) Flexible environments. C) Social groups. D) Innovative spaces.",
    "4. When making decisions, I rely on: A) Data analysis. B) Practical results. C) Others' input. D) My imagination.",
    "5. I enjoy tasks involving: A) Detailed planning. B) Hands-on work. C) Team collaboration. D) Idea generation.",
    "6. My strength is: A) Logical thinking. B) Practical skills. C) Relationships. D) Creativity.",
    "7. Under pressure, I: A) Analyze calmly. B) Act quickly. C) Seek support. D) Innovate.",
    "8. I prefer to work: A) Alone with goals. B) With tools. C) In teams. D) On new projects.",
    "9. I am energized by: A) Complex problems. B) Tangible tasks. C) People. D) New ideas.",
    "10. When planning, I: A) Strategize deeply. B) Follow steps. C) Collaborate. D) Visualize.",
    "11. I handle change by: A) Assessing risks. B) Adapting fast. C) Consulting others. D) Embracing it.",
    "12. My communication style is: A) Precise. B) Direct. C) Warm. D) Visionary.",
    "13. I value: A) Accuracy. B) Reliability. C) Harmony. D) Originality.",
    "14. When leading, I: A) Set objectives. B) Ensure completion. C) Motivate. D) Inspire.",
    "15. I reflect on: A) Outcomes. B) Lessons. C) Connections. D) Possibilities.",
    "16. I learn best through: A) Reading. B) Doing. C) Listening. D) Exploring.",
    "17. My focus is on: A) Details. B) Action. C) People. D) Concepts.",
    "18. I solve conflicts by: A) Logic. B) Compromise. C) Empathy. D) New approaches.",
    "19. I prefer feedback that is: A) Specific. B) Actionable. C) Supportive. D) Insightful.",
    "20. My work style is: A) Organized. B) Practical. C) Interactive. D) Creative.",
    "21. I am motivated by: A) Goals. B) Results. C) Recognition. D) Innovation.",
    "22. When stressed, I: A) Plan. B) Act. C) Talk. D) Reimagine.",
    "23. I build teams by: A) Structure. B) Support. C) Collaboration. D) Vision.",
    "24. My decision speed is: A) Deliberate. B) Quick. C) Consultative. D) Intuitive.",
    "25. I enjoy: A) Analysis. B) Execution. C) Socializing. D) Brainstorming.",
    "26. My leadership is: A) Directive. B) Hands-on. C) Inclusive. D) Visionary.",
    "27. I adapt to: A) Plans. B) Changes. C) People. D) Ideas.",
    "28. I prioritize: A) Logic. B) Practicality. C) Feelings. D) Creativity.",
    "29. My strength in groups is: A) Planning. B) Doing. C) Supporting. D) Innovating.",
    "30. I think about: A) Facts. B) Processes. C) Relationships. D) Future.",
    "31. I work well with: A) Systems. B) Tools. C) Teams. D) Projects.",
    "32. My approach to challenges is: A) Analytical. B) Practical. C) Emotional. D) Experimental.",
    "33. I value feedback from: A) Data. B) Experience. C) Peers. D) Mentors.",
    "34. I lead with: A) Clarity. B) Action. C) Empathy. D) Inspiration.",
    "35. My focus under pressure is: A) Strategy. B) Task. C) Support. D) Ideas.",
    "36. I enjoy learning from: A) Books. B) Practice. C) Conversations. D) Exploration.",
    "37. My communication thrives on: A) Facts. B) Action. C) Connection. D) Vision.",
    "38. I resolve issues with: A) Logic. B) Effort. C) Dialogue. D) Creativity.",
    "39. I am driven by: A) Order. B) Results. C) People. D) Discovery.",
    "40. My reflection focuses on: A) Analysis. B) Application. C) Bonds. D) Potential."
]

# Full 15 MTra Test Questions
MTRA_QUESTIONS = [
    "MTra Q1: I dwell on past mistakes. 1) Never 2) Rarely 3) Sometimes 4) Often 5) Always",
    "MTra Q2: I feel overwhelmed by changes. 1) Never 2) Rarely 3) Sometimes 4) Often 5) Always",
    "MTra Q3: I react to criticism. 1) Never 2) Rarely 3) Sometimes 4) Often 5) Always",
    "MTra Q4: I struggle to focus under stress. 1) Never 2) Rarely 3) Sometimes 4) Often 5) Always",
    "MTra Q5: I feel anxious about uncertainties. 1) Never 2) Rarely 3) Sometimes 4) Often 5) Always",
    "MTra Q6: I get irritated by interruptions. 1) Never 2) Rarely 3) Sometimes 4) Often 5) Always",
    "MTra Q7: I avoid difficult conversations. 1) Never 2) Rarely 3) Sometimes 4) Often 5) Always",
    "MTra Q8: I feel drained after interactions. 1) Never 2) Rarely 3) Sometimes 4) Often 5) Always",
    "MTra Q9: I overthink decisions. 1) Never 2) Rarely 3) Sometimes 4) Often 5) Always",
    "MTra Q10: I feel tense when plans change. 1) Never 2) Rarely 3) Sometimes 4) Often 5) Always",
    "MTra Q11: I manage emotions effectively. 1) Never 2) Rarely 3) Sometimes 4) Often 5) Always",
    "MTra Q12: I stay calm during conflicts. 1) Never 2) Rarely 3) Sometimes 4) Often 5) Always",
    "MTra Q13: I adapt behavior to others. 1) Never 2) Rarely 3) Sometimes 4) Often 5) Always",
    "MTra Q14: I recover from setbacks. 1) Never 2) Rarely 3) Sometimes 4) Often 5) Always",
    "MTra Q15: I stay grounded in challenges. 1) Never 2) Rarely 3) Sometimes 4) Often 5) Always"
]

# Mi Type Profiles
MI_TYPE_PROFILES = {
    "Imaginative Explorer": {"change_threshold": "High", "core_drive": "To explore and conceptualize"},
    "Transformational Leader": {"change_threshold": "High", "core_drive": "To inspire and lead change"},
    "Innovative Designer": {"change_threshold": "High", "core_drive": "To create elegant solutions"},
    "Creative Problem Solver": {"change_threshold": "High", "core_drive": "To overcome with creativity"},
    "Visionary Conceptualiser": {"change_threshold": "High", "core_drive": "To articulate future paradigms"},
    "Passionate Advocate": {"change_threshold": "High", "core_drive": "To champion causes"},
    "Dynamic Motivator": {"change_threshold": "High", "core_drive": "To energize action"},
    "Intuitive Strategist": {"change_threshold": "High", "core_drive": "To envision directions"},
    "Adaptive Analyst": {"change_threshold": "High", "core_drive": "To adjust with data"},
    "Logical Innovator": {"change_threshold": "High", "core_drive": "To invent systems"},
    "Holistic Integrator": {"change_threshold": "Moderate", "core_drive": "To connect and build systems"},
    "Relationship Builder": {"change_threshold": "Moderate", "core_drive": "To foster harmony"},
    "Personalised Coach": {"change_threshold": "Moderate", "core_drive": "To nurture growth"},
    "Expressive Communicator": {"change_threshold": "Moderate", "core_drive": "To engage through communication"},
    "Methodical Producer": {"change_threshold": "Moderate", "core_drive": "To achieve through planning"},
    "Structured Communicator": {"change_threshold": "Moderate", "core_drive": "To convey with precision"},
    "Empathetic Supporter": {"change_threshold": "Moderate", "core_drive": "To provide assistance"},
    "Reliable Executor": {"change_threshold": "Moderate", "core_drive": "To ensure stability"},
    "Harmonious Facilitator": {"change_threshold": "Moderate", "core_drive": "To guide interactions"},
    "Systematic Implementer": {"change_threshold": "Moderate", "core_drive": "To translate ideas"},
    "Strategic Planner": {"change_threshold": "Moderate", "core_drive": "To map objectives"},
    "Efficient Analyst": {"change_threshold": "Moderate", "core_drive": "To optimize processes"},
    "Harmonious Analyst": {"change_threshold": "Moderate", "core_drive": "To balance solutions"},
    "Detailed Organiser": {"change_threshold": "Low", "core_drive": "To create order"}
}

def calculate_mi_type(hbdi_scores, mbti_type):
    hbdi_dominance = max(hbdi_scores, key=hbdi_scores.get)
    change_threshold = "Low"
    if hbdi_dominance in ['C', 'D'] and any(c in 'EN' for c in mbti_type):
        change_threshold = "High"
    elif hbdi_dominance in ['A', 'B'] and any(c in 'ST' for c in mbti_type):
        change_threshold = "Moderate"
    mi_type_mapping = {
        'High': {'ENTP': 'Imaginative Explorer', 'ENTJ': 'Transformational Leader', 'INTP': 'Innovative Designer',
                 'ISTP': 'Creative Problem Solver', 'INFJ': 'Visionary Conceptualiser', 'ENFJ': 'Passionate Advocate',
                 'ESFP': 'Dynamic Motivator', 'ENFP': 'Intuitive Strategist', 'ESTP': 'Adaptive Analyst',
                 'INTJ': 'Logical Innovator'},
        'Moderate': {'ESFJ': 'Holistic Integrator', 'ISFJ': 'Relationship Builder', 'INFJ': 'Personalised Coach',
                     'ENFJ': 'Expressive Communicator', 'ISTJ': 'Methodical Producer', 'ESTJ': 'Structured Communicator',
                     'ISFP': 'Empathetic Supporter', 'ESFP': 'Reliable Executor', 'ISFJ': 'Harmonious Facilitator',
                     'ESTJ': 'Systematic Implementer', 'ISTJ': 'Strategic Planner', 'INTP': 'Efficient Analyst',
                     'ENFP': 'Harmonious Analyst'},
        'Low': {'ISTJ': 'Detailed Organiser'}
    }
    return mi_type_mapping.get(change_threshold, {}).get(mbti_type, 'Detailed Organiser')

class MenuScreen(Screen):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        layout = BoxLayout(orientation='vertical', padding=10, spacing=10)
        layout.add_widget(Label(text="MiType+ Beta App", size_hint=(1, 0.2), halign='center'))
        start_test_btn = Button(text="Start MiType+ Test", size_hint=(1, 0.2), background_color=PRIMARY_COLOR)
        start_test_btn.bind(on_press=self.start_test)
        mtra_btn = Button(text="Start MTra Assessment", size_hint=(1, 0.2), background_color=PRIMARY_COLOR)
        mtra_btn.bind(on_press=self.start_mtra)
        view_profiles_btn = Button(text="View Profiles", size_hint=(1, 0.2), background_color=PRIMARY_COLOR)
        view_profiles_btn.bind(on_press=self.view_profiles)
        save_btn = Button(text="Save", size_hint=(1, 0.2), background_color=PRIMARY_COLOR)
        save_btn.bind(on_press=self.show_save_dialog)
        open_btn = Button(text="Open", size_hint=(1, 0.2), background_color=PRIMARY_COLOR)
        open_btn.bind(on_press=self.show_open_dialog)
        layout.add_widget(start_test_btn)
        layout.add_widget(mtra_btn)
        layout.add_widget(view_profiles_btn)
        layout.add_widget(save_btn)
        layout.add_widget(open_btn)
        with layout.canvas.before:
            Color(*BACKGROUND_COLOR)
            self.rect = Rectangle(size=layout.size, pos=layout.pos)
            layout.bind(size=self._update_rect, pos=self._update_rect)
        self.add_widget(layout)
        self.assessment_data = {}
        self.save_dir = "saves"
        if not os.path.exists(self.save_dir):
            os.makedirs(self.save_dir)

    def _update_rect(self, instance, value):
        self.rect.pos = instance.pos
        self.rect.size = instance.size

    def start_test(self, instance):
        self.manager.current = 'assessment'

    def start_mtra(self, instance):
        self.manager.current = 'mtra'

    def view_profiles(self, instance):
        self.manager.current = 'profiles'

    def show_save_dialog(self, instance):
        content = BoxLayout(orientation='vertical')
        file_chooser = FileChooserListView(path=self.save_dir, filters=['*.json'])
        save_btn = Button(text='Save', size_hint=(1, 0.2))
        save_btn.bind(on_press=lambda x: self.save_file(file_chooser.path, file_chooser.selection and [os.path.join(file_chooser.path, f"{datetime.now().strftime('%Y-%m-%d_%H-%M')}.json")] or None))
        content.add_widget(file_chooser)
        content.add_widget(save_btn)
        self.popup = Popup(title="Save", content=content, size_hint=(0.9, 0.9))
        self.popup.open()

    def save_file(self, path, filename):
        if filename and filename[0]:
            save_path = filename[0]
        else:
            save_path = os.path.join(path, f"{datetime.now().strftime('%Y-%m-%d_%H-%M')}.json")
        with open(save_path, 'w') as f:
            json.dump(self.assessment_data, f)
        self.popup.dismiss()

    def show_open_dialog(self, instance):
        content = BoxLayout(orientation='vertical')
        file_chooser = FileChooserListView(path=self.save_dir, filters=['*.json'])
        open_btn = Button(text='Open', size_hint=(1, 0.2))
        open_btn.bind(on_press=lambda x: self.open_file(file_chooser.selection))
        content.add_widget(file_chooser)
        content.add_widget(open_btn)
        self.popup = Popup(title="Open", content=content, size_hint=(0.9, 0.9))
        self.popup.open()

    def open_file(self, selection):
        if selection:
            with open(selection[0], 'r') as f:
                self.assessment_data = json.load(f)
                if 'mtra_scores' in self.assessment_data:
                    self.manager.get_screen('mtra').load_data(self.assessment_data)
                    self.manager.current = 'mtra'
                else:
                    self.manager.get_screen('assessment').load_data(self.assessment_data)
                    self.manager.current = 'assessment'
        self.popup.dismiss()

class AssessmentScreen(Screen):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.questions = MITYPE_QUESTIONS
        layout = BoxLayout(orientation='vertical', padding=10)
        self.page_label = Label(text="Page 1 of 8", size_hint=(1, 0.1), halign='center')
        self.question_label = Label(text="", size_hint=(1, 0.6), halign='center', valign='top')
        self.options_layout = BoxLayout(orientation='vertical', size_hint=(1, 0.2))
        self.answer_input = TextInput(size_hint=(1, 0.1), multiline=False, hint_text="Enter A, B, C, or D")
        self.answer_input.bind(on_text_validate=self.submit_answer)
        nav_layout = BoxLayout(size_hint=(1, 0.1))
        self.prev_btn = Button(text="Previous", size_hint=(0.5, 1))
        self.prev_btn.bind(on_press=self.go_previous)
        self.next_btn = Button(text="Next", size_hint=(0.5, 1))
        self.next_btn.bind(on_press=self.go_next)
        nav_layout.add_widget(self.prev_btn)
        nav_layout.add_widget(self.next_btn)
        layout.add_widget(self.page_label)
        layout.add_widget(self.question_label)
        layout.add_widget(self.options_layout)
        layout.add_widget(self.answer_input)
        layout.add_widget(nav_layout)
        with layout.canvas.before:
            Color(*BACKGROUND_COLOR)
            self.rect = Rectangle(size=layout.size, pos=layout.pos)
            layout.bind(size=self._update_rect, pos=self._update_rect)
        self.add_widget(layout)
        self.current_q = 0
        self.hbdi_scores = {'A': 0, 'B': 0, 'C': 0, 'D': 0}
        self.selected_option = None
        self.update_question()

    def _update_rect(self, instance, value):
        self.rect.pos = instance.pos
        self.rect.size = instance.size

    def update_question(self):
        total_pages = (len(self.questions) + 4) // 5  # 8 pages
        if self.current_q < total_pages:
            start_idx = self.current_q * 5
            end_idx = min(start_idx + 5, len(self.questions))
            questions = self.questions[start_idx:end_idx]
            self.page_label.text = f"Page {self.current_q + 1} of {total_pages}"
            self.question_label.text = "\n\n".join(f"{q.split(': ')[0]}: {q.split(': ')[1].split('. ')[0]}" for q in questions)
            self.options_layout.clear_widgets()
            all_options = []
            for q in questions:
                _, options = q.split(': ', 1)
                opts = options.split('. ')[1:]
                all_options.extend([f"{opt[0]}) {opt[2:]}" for opt in opts if opt[0] in 'ABCD'])
            for opt in all_options:
                btn = ToggleButton(text=opt, group='assessment', size_hint=(1, 0.25))
                btn.bind(on_state=self.on_option_select)
                self.options_layout.add_widget(btn)
        self.prev_btn.disabled = self.current_q == 0
        self.next_btn.text = "Submit" if self.current_q == total_pages - 1 else "Next"

    def on_option_select(self, instance, value):
        if value == 'down':
            self.selected_option = instance.text[0]
            self.answer_input.text = self.selected_option
        else:
            if self.selected_option == instance.text[0]:
                self.selected_option = None
                self.answer_input.text = ""

    def go_previous(self, instance):
        if self.current_q > 0:
            self.current_q -= 1
            self.update_question()
            self.answer_input.text = ""
            self.selected_option = None
            for btn in self.options_layout.children:
                btn.state = 'normal'

    def go_next(self, instance):
        total_pages = (len(self.questions) + 4) // 5
        if self.current_q < total_pages - 1:
            self.current_q += 1
            self.update_question()
            self.answer_input.text = ""
            self.selected_option = None
            for btn in self.options_layout.children:
                btn.state = 'normal'

    def submit_answer(self, instance):
        answer = self.answer_input.text.upper() if self.answer_input.text else self.selected_option
        total_pages = (len(self.questions) + 4) // 5
        if answer in ['A', 'B', 'C', 'D'] and self.current_q < total_pages - 1:
            self.hbdi_scores[answer] += 1
            self.current_q += 1
            self.update_question()
            self.answer_input.text = ""
            self.selected_option = None
            for btn in self.options_layout.children:
                btn.state = 'normal'
        elif self.current_q == total_pages - 1 and answer in ['A', 'B', 'C', 'D']:
            self.hbdi_scores[answer] += 1
            self.analyze_scores()
            self.manager.get_screen('menu').assessment_data = self.assessment_data
            self.manager.get_screen('menu').save_file(self.manager.get_screen('menu').save_dir, [os.path.join(self.manager.get_screen('menu').save_dir, f"{datetime.now().strftime('%Y-%m-%d_%H-%M')}.json")])
            self.manager.current = 'mtra'

    def analyze_scores(self):
        total_hbdi = sum(self.hbdi_scores.values())
        hbdi_normalized = {k: (v / total_hbdi * 100) if total_hbdi else 0 for k, v in self.hbdi_scores.items()}
        mbti_type = 'ENTJ'  # Placeholder
        mi_type = calculate_mi_type(hbdi_normalized, mbti_type)
        self.assessment_data = {"hbdi_scores": hbdi_normalized, "mbti_type": mbti_type, "mi_type": mi_type}

    def load_data(self, data):
        self.assessment_data = data
        self.hbdi_scores = data.get('hbdi_scores', {'A': 0, 'B': 0, 'C': 0, 'D': 0})
        self.current_q = (len(self.questions) + 4) // 5 - 1 if data.get('hbdi_scores') else 0
        self.update_question()
        self.answer_input.text = ""

class MtraScreen(Screen):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.questions = MTRA_QUESTIONS
        layout = BoxLayout(orientation='vertical', padding=10)
        self.page_label = Label(text="Page 1 of 3", size_hint=(1, 0.1), halign='center')
        self.question_label = Label(text="", size_hint=(1, 0.6), halign='center', valign='top')
        self.options_layout = BoxLayout(orientation='vertical', size_hint=(1, 0.2))
        self.answer_input = TextInput(size_hint=(1, 0.1), input_filter='int', multiline=False, hint_text="Enter 1-5")
        self.answer_input.bind(on_text_validate=self.submit_answer)
        nav_layout = BoxLayout(size_hint=(1, 0.1))
        self.prev_btn = Button(text="Previous", size_hint=(0.5, 1))
        self.prev_btn.bind(on_press=self.go_previous)
        self.next_btn = Button(text="Next", size_hint=(0.5, 1))
        self.next_btn.bind(on_press=self.go_next)
        nav_layout.add_widget(self.prev_btn)
        nav_layout.add_widget(self.next_btn)
        layout.add_widget(self.page_label)
        layout.add_widget(self.question_label)
        layout.add_widget(self.options_layout)
        layout.add_widget(self.answer_input)
        layout.add_widget(nav_layout)
        with layout.canvas.before:
            Color(*BACKGROUND_COLOR)
            self.rect = Rectangle(size=layout.size, pos=layout.pos)
            layout.bind(size=self._update_rect, pos=self._update_rect)
        self.add_widget(layout)
        self.current_q = 0
        self.scores = {}
        self.selected_option = None
        self.update_question()

    def _update_rect(self, instance, value):
        self.rect.pos = instance.pos
        self.rect.size = instance.size

    def update_question(self):
        total_pages = (len(self.questions) + 4) // 5  # 3 pages
        if self.current_q < total_pages:
            start_idx = self.current_q * 5
            end_idx = min(start_idx + 5, len(self.questions))
            questions = self.questions[start_idx:end_idx]
            self.page_label.text = f"Page {self.current_q + 1} of {total_pages}"
            self.question_label.text = "\n\n".join(f"{q.split(': ')[0]}: {q.split(': ')[1].split('. ')[0]}" for q in questions)
            self.options_layout.clear_widgets()
            all_options = []
            for q in questions:
                _, options = q.split(': ', 1)
                opts = options.split('. ')[1:]
                all_options.extend([f"{opt[0]}) {opt[2:]}" for opt in opts if opt[0].isdigit() and 1 <= int(opt[0]) <= 5])
            for opt in all_options:
                btn = ToggleButton(text=opt, group='mtra', size_hint=(1, 0.25))
                btn.bind(on_state=self.on_option_select)
                self.options_layout.add_widget(btn)
        self.prev_btn.disabled = self.current_q == 0
        self.next_btn.text = "Submit" if self.current_q == total_pages - 1 else "Next"

    def on_option_select(self, instance, value):
        if value == 'down':
            self.selected_option = instance.text[0]
            self.answer_input.text = self.selected_option
        else:
            if self.selected_option == instance.text[0]:
                self.selected_option = None
                self.answer_input.text = ""

    def go_previous(self, instance):
        if self.current_q > 0:
            self.current_q -= 1
            self.update_question()
            self.answer_input.text = ""
            self.selected_option = None
            for btn in self.options_layout.children:
                btn.state = 'normal'

    def go_next(self, instance):
        total_pages = (len(self.questions) + 4) // 5
        if self.current_q < total_pages - 1:
            self.current_q += 1
            self.update_question()
            self.answer_input.text = ""
            self.selected_option = None
            for btn in self.options_layout.children:
                btn.state = 'normal'

    def submit_answer(self, instance):
        answer = self.answer_input.text if self.answer_input.text else self.selected_option
        total_pages = (len(self.questions) + 4) // 5
        if answer and 1 <= int(answer) <= 5 and self.current_q < total_pages - 1:
            self.scores[f'q{self.current_q + 1}'] = int(answer)
            self.current_q += 1
            self.update_question()
            self.answer_input.text = ""
            self.selected_option = None
            for btn in self.options_layout.children:
                btn.state = 'normal'
        elif self.current_q == total_pages - 1 and answer and 1 <= int(answer) <= 5:
            self.scores[f'q{self.current_q + 1}'] = int(answer)
            self.analyze_scores()
            self.manager.get_screen('menu').assessment_data.update(self.assessment_data)
            self.manager.get_screen('menu').save_file(self.manager.get_screen('menu').save_dir, [os.path.join(self.manager.get_screen('menu').save_dir, f"{datetime.now().strftime('%Y-%m-%d_%H-%M')}.json")])
            self.manager.current = 'menu'

    def analyze_scores(self):
        stress_factors = sum(self.scores.get(f'q{i}', 0) for i in range(1, 6)) / 5
        trigger_responses = sum(self.scores.get(f'q{i}', 0) for i in range(6, 11)) / 5
        emotional_regulation = sum(self.scores.get(f'q{i}', 0) for i in range(11, 16)) / 5
        sf_level = "Low" if stress_factors <= 2 else "Moderate" if stress_factors <= 3.5 else "High"
        tr_level = "Mild" if trigger_responses <= 2 else "Noticeable" if trigger_responses <= 3.5 else "Intense"
        er_level = "Weak" if emotional_regulation <= 2 else "Developing" if emotional_regulation <= 3.5 else "Strong"
        mtra_profile = f"{sf_level} {tr_level} {er_level} Reflector"
        change_threshold = "HCT" if emotional_regulation >= 3.6 else "MCT" if emotional_regulation >= 2.1 else "LCT"
        highertends = {"HCT": ["Adaptability", "Innovation"], "MCT": ["Balance", "Consistency"], "LCT": ["Stability", "Detail"]}[change_threshold]
        egotends = {"HCT": ["Overextension", "Impulsivity"], "MCT": ["Indecision", "Routine"], "LCT": ["Resistance", "Perfectionism"]}[change_threshold]
        combined_data = self.manager.get_screen('menu').assessment_data
        hbdi_scores = combined_data.get('hbdi_scores', {'A': 0, 'B': 0, 'C': 0, 'D': 0})
        mbti_type = combined_data.get('mbti_type', 'XXXX')
        dominant_hbdi = max(hbdi_scores, key=hbdi_scores.get)
        mtra_scores = {"sf": stress_factors, "tr": trigger_responses, "er": emotional_regulation}
        mi_type_mapping = {
            'HCT': {'ENTP': 'Imaginative Explorer', 'ENTJ': 'Transformational Leader', 'INTP': 'Innovative Designer',
                    'ISTP': 'Creative Problem Solver', 'INFJ': 'Visionary Conceptualiser', 'ENFJ': 'Passionate Advocate',
                    'ESFP': 'Dynamic Motivator', 'ENFP': 'Intuitive Strategist', 'ESTP': 'Adaptive Analyst',
                    'INTJ': 'Logical Innovator'},
            'MCT': {'ESFJ': 'Holistic Integrator', 'ISFJ': 'Relationship Builder', 'INFJ': 'Personalised Coach',
                    'ENFJ': 'Expressive Communicator', 'ISTJ': 'Methodical Producer', 'ESTJ': 'Structured Communicator',
                    'ISFP': 'Empathetic Supporter', 'ESFP': 'Reliable Executor', 'ISFJ': 'Harmonious Facilitator',
                    'ESTJ': 'Systematic Implementer', 'ISTJ': 'Strategic Planner', 'INTP': 'Efficient Analyst',
                    'ENFP': 'Harmonious Analyst'},
            'LCT': {'ISTJ': 'Detailed Organiser'}
        }
        mi_type = mi_type_mapping.get(change_threshold, {}).get(mbti_type, 'Detailed Organiser')
        self.assessment_data = {
            "hbdi_scores": hbdi_scores, "mbti_type": mbti_type, "dominant_hbdi": dominant_hbdi, "mtra_scores": mtra_scores,
            "profile": {"change_threshold": change_threshold, "mtra_profile": mtra_profile, "mi_type": mi_type,
                        "highertends": highertends, "egotends": egotends}
        }

    def load_data(self, data):
        self.assessment_data = data
        self.scores = data.get('mtra_scores', {})
        self.current_q = (len(self.questions) + 4) // 5 - 1 if self.scores else 0
        self.update_question()
        self.answer_input.text = ""

class ProfilesScreen(Screen):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        layout = BoxLayout(orientation='vertical', padding=10)
        self.page_label = Label(text="Page 1 of 5", size_hint=(1, 0.1))
        self.profile_label = Label(text="", size_hint=(1, 0.8))
        nav_layout = BoxLayout(size_hint=(1, 0.1))
        self.prev_btn = Button(text="Previous", size_hint=(0.5, 1))
        self.prev_btn.bind(on_press=self.go_previous)
        self.next_btn = Button(text="Next", size_hint=(0.5, 1))
        self.next_btn.bind(on_press=self.go_next)
        nav_layout.add_widget(self.prev_btn)
        nav_layout.add_widget(self.next_btn)
        layout.add_widget(self.page_label)
        layout.add_widget(self.profile_label)
        layout.add_widget(nav_layout)
        with layout.canvas.before:
            Color(*BACKGROUND_COLOR)
            self.rect = Rectangle(size=layout.size, pos=layout.pos)
            layout.bind(size=self._update_rect, pos=self._update_rect)
        self.add_widget(layout)
        self.current_page = 0
        self.page_size = 5
        self.update_profiles()

    def _update_rect(self, instance, value):
        self.rect.pos = instance.pos
        self.rect.size = instance.size

    def update_profiles(self):
        profiles = list(MI_TYPE_PROFILES.items())
        total_pages = (len(profiles) + self.page_size - 1) // self.page_size
        start_idx = self.current_page * self.page_size
        end_idx = min(start_idx + self.page_size, len(profiles))
        self.page_label.text = f"Page {self.current_page + 1} of {total_pages}"
        self.profile_label.text = "\n".join(f"{k}: {v['core_drive']}" for k, v in profiles[start_idx:end_idx])
        self.prev_btn.disabled = self.current_page == 0
        self.next_btn.disabled = end_idx >= len(profiles)

    def go_previous(self, instance):
        if self.current_page > 0:
            self.current_page -= 1
            self.update_profiles()

    def go_next(self, instance):
        if (self.current_page + 1) * self.page_size < len(MI_TYPE_PROFILES):
            self.current_page += 1
            self.update_profiles()

class MiTypeApp(App):
    def build(self):
        try:
            sm = ScreenManager()
            sm.add_widget(MenuScreen(name='menu'))
            sm.add_widget(AssessmentScreen(name='assessment'))
            sm.add_widget(MtraScreen(name='mtra'))
            sm.add_widget(ProfilesScreen(name='profiles'))
            with sm.canvas.before:
                Color(*BACKGROUND_COLOR)
                self.rect = Rectangle(size=sm.size, pos=sm.pos)
                sm.bind(size=self._update_rect, pos=self._update_rect)
            logger.debug("Build completed successfully")
            return sm
        except Exception as e:
            logger.error(f"Build failed: {e}")
            raise

    def _update_rect(self, instance, value):
        if hasattr(self, 'rect'):
            self.rect.pos = instance.pos
            self.rect.size = instance.size

if __name__ == '__main__':
    MiTypeApp().run()