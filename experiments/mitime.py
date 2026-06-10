# mitype_mtra_recommendations.py

def display_header(title):
    """Prints a formatted header for sections."""
    print(f"\n{'=' * 70}")
    print(f" {title.upper()} ")
    print(f"{'=' * 70}")

# This dictionary stores all 24 Mi Type profiles and their MTra/MiTime recommendations.
# Content extracted from your Google Drive documents.
MI_TYPE_MTRA_RECOMMENDATIONS = {
    "Imaginative Explorer (IE)": {
        "Change Threshold": "High Change Threshold (HCT, 'Lift')",
        "MiTime Profile": "Time management for the Imaginative Explorer is a real adventure. You love exploring new possibilities and timetables, using your creativity to adapt to unexpected changes. You manage time by dreaming up innovative plans, often rethinking traditional setups to suit evolving needs. You see schedules as flexible canvases, not rigid structures.",
        "Time Management Plan": [
            "Embrace Flexibility: Avoid overly rigid schedules. Allow for spontaneous detours and new ideas.",
            "Thematic Time Blocking: Instead of strict hour-by-hour planning, allocate large blocks for 'exploration,' 'brainstorming,' or 'conceptual work.'",
            "Idea Capture System: Keep a readily accessible system (digital or physical) to quickly note down new ideas or tangents without derailing your current task.",
            "Deadline Awareness: While creative, be mindful of external deadlines. Set reminders for submission dates or key milestones.",
            "Collaborate on Structure: If disorganization is an Egotend, collaborate with a more 'Anchor' type (e.g., Detailed Organiser) for accountability on execution and follow-through."
        ]
    },
    "Transformational Leader (TL)": {
        "Change Threshold": "High Change Threshold (HCT, 'Lift')",
        "MiTime Profile": "The Transformational Leader shines at managing time by inspiring their team to embrace shifting priorities. You focus on key deadlines, motivating others to adapt to new challenges, turning time pressures into chances for growth and leadership. You use time strategically to mobilize and align others towards a shared vision.",
        "Time Management Plan": [
            "Vision-Driven Scheduling: Prioritize tasks and projects that directly contribute to your long-term vision. Delegate anything that doesn't.",
            "Empower Delegation: Trust your team to handle details. Provide clear outcomes and deadlines, then step back.",
            "Strategic Communication: Use dedicated time for communicating vision, setting expectations, and inspiring collective action.",
            "Adaptable Milestones: Focus on major milestones rather than granular daily tasks, allowing flexibility for the team to adapt.",
            "\"Future Focus\" Slots: Schedule time for strategic thinking, trend analysis, and future planning to stay ahead of the curve."
        ]
    },
    "Innovative Designer (ID)": {
        "Change Threshold": "High Change Threshold (HCT, 'Lift')",
        "MiTime Profile": "Innovative Designers manage time by crafting sleek, forward-thinking plans. You fine-tune timetables with precision, adapting to change by designing efficient systems and adding new tools, ensuring time works well for future goals. You view time as a resource to be elegantly optimized.",
        "Time Management Plan": [
            "System Design First: Before diving into tasks, spend time designing the most efficient workflow or system.",
            "Iterative Planning: Embrace 'adaptive design' in your schedule. Plan, test, refine. Don't be afraid to redesign your time blocks if a better method emerges.",
            "Tool Integration: Continuously seek and integrate new time management tools or software that enhance precision and efficiency.",
            "\"Deep Work\" Blocks: Allocate uninterrupted time for conceptualization and detailed design work where you can focus on quality.",
            "Buffer for Perfectionism: Build in extra buffer time for projects to account for your natural tendency towards perfectionism, preventing delays."
        ]
    },
    "Creative Problem Solver (CPS)": {
        "Change Threshold": "High Change Threshold (HCT, 'Lift')",
        "MiTime Profile": "Creative Problem Solvers manage time by finding clever ways to work around challenges. You use your adaptability to quickly adjust plans, turning time-based obstacles into chances for innovative solutions. You see schedules as dynamic puzzles to be solved creatively.",
        "Time Management Plan": [
            "Problem-Focused Sprints: Dedicate focused time blocks to tackle specific challenges or bottlenecks, using brainstorming and rapid prototyping techniques.",
            "Flexible Buffers: Build generous buffers into your schedule for unexpected issues, but use these buffers actively for creative problem-solving.",
            "Mind Mapping/Brainstorming Slots: Schedule dedicated time for divergent thinking to generate multiple solutions when faced with a time constraint.",
            "Deconstruct Deadlines: Break down complex deadlines into smaller, manageable 'mini-problems' to be solved sequentially.",
            "\"Solution-Seeking\" Breaks: Use short breaks to reframe problems and approach them from a new angle, avoiding mental fatigue."
        ]
    },
    "Visionary Conceptualiser (VC)": {
        "Change Threshold": "High Change Threshold (HCT, 'Lift')",
        "MiTime Profile": "Visionary Conceptualisers manage time by focusing on the big picture, creating sweeping, future-oriented timetables. You adapt by re-imagining schedules to align with grander visions, ensuring time is used to shape future paradigms. You are less concerned with immediate details and more with the overarching trajectory.",
        "Time Management Plan": [
            "Strategic Visioning Blocks: Allocate significant time for long-term planning, conceptualizing future projects, and defining overarching goals.",
            "Delegate Detail: Offload granular scheduling and task management to others, allowing you to maintain a high-level focus.",
            "Future-Proofing: When making scheduling decisions, consider their long-term implications and how they align with your overarching vision.",
            "High-Level Milestones: Focus on establishing major project milestones rather than daily task lists, allowing for flexible execution.",
            "Regular Re-alignment: Periodically review your schedule against your long-term vision to ensure you're on track and making progress towards your most important goals."
        ]
    },
    "Passionate Advocate (PA)": {
        "Change Threshold": "High Change Threshold (HCT, 'Lift')",
        "MiTime Profile": "Passionate Advocates manage time by championing causes and inspiring action. You adapt your schedule to align with what you deeply believe in, using time to mobilize others. You're driven by conviction, making your timetable a tool for impactful change.",
        "Time Management Plan": [
            "Values-Driven Prioritization: Schedule tasks that directly contribute to your core values and causes first.",
            "Community/Networking Blocks: Allocate time for engaging with others, building alliances, and advocating for your beliefs.",
            "Energy Management: Be mindful of your energy levels, as passionate advocacy can be draining. Schedule restorative activities.",
            "\"Impact\" Reviews: Regularly assess how your time is translating into tangible impact for the causes you champion, adjusting as needed.",
            "Boundaries for Burnout: While passionate, set clear boundaries to avoid overcommitting and potential burnout. Learn to say no."
        ]
    },
    "Holistic Integrator (HI)": {
        "Change Threshold": "Moderate Change Threshold (MCT, 'Median')",
        "MiTime Profile": "Holistic Integrators manage time by linking timetable elements into solid systems. You balance planning with team needs, adapting moderately to change while ensuring everything fits together smoothly. Your time management is about creating cohesive, interconnected flows.",
        "Time Management Plan": [
            "Interconnected Scheduling: View your schedule as a system where each task affects others. Plan with dependencies in mind.",
            "Collaborative Planning Sessions: Dedicate time for team planning to ensure all perspectives are integrated into the timetable.",
            "\"Buffer for Synergy\": Build in buffer time not just for individual tasks, but for the synthesis and integration of different project components.",
            "Systemic Review: Regularly review your time management system as a whole, looking for points of friction or opportunities for better integration.",
            "Mindful Decisiveness: When over-analysis (Egotend) strikes, use time-boxed decision-making to avoid paralysis, focusing on the most effective path forward."
        ]
    },
    "Relationship Builder (RB)": {
        "Change Threshold": "Moderate Change Threshold (MCT, 'Median')",
        "MiTime Profile": "Relationship Builders manage time by weaving social connections into their schedules. You prioritize collaborative work, balancing tasks with nurturing interactions, adapting moderately to change if it supports harmony. Your time management fosters strong bonds.",
        "Time Management Plan": [
            "Relationship-Centric Scheduling: Prioritize meetings and interactions that strengthen relationships and foster collaboration.",
            "Communication Blocks: Dedicate specific time for responding to emails, making calls, and engaging in supportive communication.",
            "\"Social Capital\" Investments: Schedule time for informal check-ins, coffee breaks, or team-building activities.",
            "Conflict Resolution Slots: Be prepared to allocate time for addressing interpersonal issues promptly to maintain harmony.",
            "Set Boundaries (for self): While you love connecting, learn to set boundaries on social demands to protect your productive time."
        ]
    },
    "Personalised Coach (PC)": {
        "Change Threshold": "Moderate Change Threshold (MCT, 'Median')",
        "MiTime Profile": "Personalised Coaches manage time by tailoring schedules to individual growth. You adapt plans to support others' needs, balancing your tasks with mentoring and guidance. Your time management empowers personal development.",
        "Time Management Plan": [
            "One-on-One Session Slots: Dedicate regular, protected time for individual coaching or mentoring sessions.",
            "Feedback & Development Time: Schedule time for providing constructive feedback and helping others identify growth opportunities.",
            "Adaptable Support: Be prepared to adjust your schedule to provide timely support or guidance when an individual needs it.",
            "Resource Curation: Allocate time to research and compile resources that can aid in the personal and professional development of others.",
            "Self-Care for Empathy: As you expend significant emotional energy, ensure you schedule self-care time to recharge and prevent burnout."
        ]
    },
    "Expressive Communicator (EC)": {
        "Change Threshold": "Moderate Change Threshold (MCT, 'Median')",
        "MiTime Profile": "Expressive Communicators manage time by focusing on clear, engaging interactions. You adapt your schedule to ensure your message is heard, balancing tasks with effective dialogue. Your time management is all about impactful communication.",
        "Time Management Plan": [
            "Communication Prep Time: Allocate dedicated time for preparing presentations, writing engaging content, or rehearsing key messages.",
            "Audience-Centric Scheduling: Consider the best times for your audience when scheduling communications or meetings.",
            "Q&A/Discussion Blocks: Build in time for open discussion and feedback after you've conveyed your message.",
            "\"Reflection on Impact\": After a communication event, take time to reflect on its effectiveness and how it could be improved.",
            "Conciseness Practice: If over-explaining (Egotend) is an issue, practice summarizing your points concisely to respect others' time."
        ]
    },
    "Methodical Producer (MP)": {
        "Change Threshold": "Moderate Change Threshold (MCT, 'Median')",
        "MiTime Profile": "Methodical Producers manage time by diligently following structured plans. You adapt by refining your systems, balancing efficiency with thoroughness. Your time management is about consistent, high-quality output.",
        "Time Management Plan": [
            "Process-Oriented Planning: Break down tasks into clear, repeatable steps and allocate time for each stage of the process.",
            "Batching Similar Tasks: Group similar activities (e.g., all emails, all data entry) into dedicated time blocks to improve efficiency.",
            "Routine Adherence: Establish and consistently follow daily and weekly routines to build momentum and predictability.",
            "Quality Control Checkpoints: Build in time for thorough review and quality checks at key stages of a project.",
            "Scheduled Review of Systems: Periodically review your methods and systems, making small, iterative improvements rather than large disruptions."
        ]
    },
    "Strategic Planner (SP)": {
        "Change Threshold": "Moderate Change Threshold (MCT, 'Median')",
        "MiTime Profile": "Strategic Planners manage time by mapping out long-term objectives with precision. You balance foresight with adaptability, ensuring plans remain aligned with strategic goals even when conditions shift moderately. Your time management is about deliberate, forward-thinking execution.",
        "Time Management Plan": [
            "Long-Term Planning Blocks: Dedicate significant time to strategic thinking, goal setting, and outlining multi-phase projects.",
            "Contingency Planning: Build in 'what if' scenarios and alternative paths into your schedule for potential disruptions.",
            "Regular Progress Reviews: Schedule recurring time to review progress against strategic goals and adjust as necessary.",
            "Delegation of Tactics: Focus on the 'what' and 'why,' delegating the 'how' to others where appropriate.",
            "Information Gathering Slots: Allocate time for research and analysis to inform your strategic decisions and ensure plans are well-founded."
        ]
    },
    "Detailed Organiser (DO)": {
        "Change Threshold": "Low Change Threshold (LCT, 'Anchor')",
        "MiTime Profile": "Detailed Organisers manage time by creating precise, steady timetables. You prefer minimal change, ensuring every minute is sorted, providing consistency. Your time management is about meticulous planning and adherence to a finely tuned schedule.",
        "Time Management Plan": [
            "Micro-Scheduling: Plan your days and weeks in meticulous detail, including specific time blocks for every task.",
            "Consistency is Key: Stick to your planned schedule as much as possible. Resist the urge for spontaneous diversions.",
            "Pre-Planned Contingencies: Anticipate potential minor disruptions and build small, pre-defined 'buffer zones' into your schedule for them.",
            "Review and Refine Routines: Regularly review your established routines for efficiency and make small, incremental improvements rather than large, sudden changes.",
            "Communicate Your Structure: Inform others of your planned schedule and preferences for stability to manage expectations and minimize interruptions."
        ]
    },
    "Reliable Executor (RE)": {
        "Change Threshold": "Low Change Threshold (LCT, 'Anchor')",
        "MiTime Profile": "Reliable Executors manage time by consistently delivering on commitments. You prefer stable routines, ensuring tasks are completed dependably and on schedule. Your time management is about trustworthy, consistent output.",
        "Time Management Plan": [
            "Task-Focused Blocks: Dedicate concentrated time blocks to completing specific tasks from start to finish.",
            "Daily Task List: Create and rigorously follow a daily to-do list, checking off items as they are completed.",
            "Minimal Distractions: Create an environment with minimal distractions to ensure uninterrupted focus on execution.",
            "Regular Check-ins: If working with a team, provide regular, predictable updates on your progress to build trust.",
            "\"Completion\" Rituals: Establish small routines to mark the completion of tasks, reinforcing your sense of accomplishment and readiness for the next item."
        ]
    },
    "Supportive Implementer (SI)": {
        "Change Threshold": "Low Change Threshold (LCT, 'Anchor')",
        "MiTime Profile": "Supportive Implementers manage time by consistently supporting others in their tasks. You prefer established processes, ensuring that team efforts are well-coordinated and maintained. Your time management fosters steady, dependable assistance.",
        "Time Management Plan": [
            "Shared Calendar/Task Management: Utilise shared systems to track team progress and identify where your support is most needed.",
            "Predictable Availability: Establish clear times when you are available for support or collaboration to provide stability to others.",
            "Process Adherence: Follow established procedures for support requests and task delegation to ensure smooth workflow.",
            "Proactive Support: Anticipate common needs or questions and prepare resources or responses in advance to save time.",
            "Boundaries for Over-Giving: While generous, be mindful of your own capacity and set boundaries to avoid over-committing to others' needs."
        ]
    },
    "Systematic Analyst (SA)": {
        "Change Threshold": "Low Change Threshold (LCT, 'Anchor')",
        "MiTime Profile": "Systematic Analysts manage time by breaking down complex problems into manageable steps, focusing on methodical review. You prefer predictable research processes, ensuring every detail is examined for accurate understanding. Your time management is about thorough, logical investigation.",
        "Time Management Plan": [
            "Deep Dive Blocks: Allocate extensive, uninterrupted time for detailed analysis, research, and data review.",
            "Structured Information Flow: Implement a system for organising and categorising information to facilitate efficient retrieval and analysis.",
            "Sequential Processing: Approach tasks in a logical, step-by-step manner, completing one phase before moving to the next.",
            "Fact-Checking Protocols: Build in dedicated time for verifying data and cross-referencing information to ensure accuracy.",
            "Scheduled Review of Findings: Plan regular intervals to summarise and synthesise your findings, ensuring comprehensive understanding before moving forward."
        ]
    },
    "Empathetic Listener (EL)": {
        "Change Threshold": "Moderate Change Threshold (MCT, 'Median')",
        "MiTime Profile": "Empathetic Listeners manage time by creating space for deep understanding and connection. You adapt your schedule to truly hear others, balancing your tasks with compassionate engagement. Your time management nurtures profound rapport.",
        "Time Management Plan": [
            "Dedicated Listening Slots: Schedule specific, uninterrupted time for one-on-one conversations where you can fully focus on listening.",
            "Follow-Up Time: Allocate time for processing what you've heard and for thoughtful follow-up actions.",
            "Minimize Distractions: Create an environment free from interruptions during crucial listening moments.",
            "Non-Verbal Observation: Build awareness of non-verbal cues by observing body language and tone, enhancing your understanding without needing more direct 'talking' time.",
            "Emotional Processing Time: As you absorb others' emotions, ensure you schedule time for your own emotional processing and regulation."
        ]
    },
    "Practical Implementer (PI)": {
        "Change Threshold": "Moderate Change Threshold (MCT, 'Median')",
        "MiTime Profile": "Practical Implementers manage time by efficiently putting plans into action. You balance methodical execution with adaptability, ensuring that solutions are applied effectively and consistently. Your time management is about tangible, reliable results.",
        "Time Management Plan": [
            "Action-Oriented Scheduling: Prioritize tasks that lead to immediate, tangible results.",
            "Step-by-Step Execution: Break down larger projects into smaller, actionable steps and assign specific time blocks to each.",
            "Resource Allocation: Efficiently allocate necessary resources (tools, materials, support) to ensure smooth implementation.",
            "Troubleshooting Blocks: Schedule short, flexible blocks for addressing unexpected issues that arise during implementation.",
            "Post-Implementation Review: Dedicate time to review the effectiveness of implemented solutions and identify areas for improvement."
        ]
    },
    "Balanced Mediator (BM)": {
        "Change Threshold": "Moderate Change Threshold (MCT, 'Median')",
        "MiTime Profile": "Balanced Mediators manage time by fostering fairness and understanding in group dynamics. You adapt your schedule to bridge differences, balancing your tasks with facilitating harmonious interactions. Your time management promotes equilibrium and mutual respect.",
        "Time Management Plan": [
            "Dispute Resolution Slots: Allocate dedicated time for mediating conflicts or facilitating difficult conversations.",
            "Pre-Meeting Prep: Schedule time to understand all perspectives before mediating, ensuring a balanced approach.",
            "Follow-Up & Reconciliation: Build in time for follow-up with all parties involved to ensure resolutions hold and relationships are mended.",
            "Group Consensus Building: Allow ample time for discussions that aim for consensus rather than quick decisions.",
            "Self-Care for Neutrality: Engage in activities that help you maintain impartiality and emotional balance, preventing personal bias from affecting your mediation."
        ]
    },
    "Resource Optimiser (RO)": {
        "Change Threshold": "Moderate Change Threshold (MCT, 'Median')",
        "MiTime Profile": "Resource Optimisers manage time by shrewdly allocating resources to maximize efficiency. You balance methodical planning with adaptable distribution, ensuring that every asset, including time, is used to its fullest potential. Your time management is about strategic efficiency.",
        "Time Management Plan": [
            "Resource Auditing: Regularly schedule time to assess available resources (including your own time and energy) and identify areas for optimization.",
            "Constraint-Based Scheduling: Plan your tasks and projects based on the availability and limitations of critical resources.",
            "Strategic Automation: Invest time in setting up automated processes or tools that free up your time for higher-value activities.",
            "Prioritisation by ROI: When faced with multiple tasks, prioritize those that offers the highest return on time investment.",
            "\"Waste Reduction\" Review: Periodically review your workflows to identify and eliminate time-wasting activities or processes."
        ]
    },
    "Analytical Thinker (AT)": {
        "Change Threshold": "Moderate Change Threshold (MCT, 'Median')",
        "MiTime Profile": "Analytical Thinkers manage time by applying logic and structure to their schedules. You balance detailed planning with the need to explore all angles, adapting to new data while maintaining systematic processes. Your time management is precise and evidence-based.",
        "Time Management Plan": [
            "Data Collection Blocks: Allocate dedicated time for gathering and verifying data pertinent to your tasks and decisions.",
            "Logical Sequencing: Structure your tasks in a logical, step-by-step order, ensuring one phase is completed before the next begins.",
            "\"What If\" Analysis: Build in time for scenario planning and considering different outcomes before committing to a course of action.",
            "Critical Review Sessions: Schedule time for reviewing your own work and others' for logical flaws or inconsistencies.",
            "Concise Documentation: Practice documenting your analysis clearly and concisely to save time in future reviews or explanations."
        ]
    },
    "Process Implementer (PIp)": { # Note: Renamed from PI if there's another PI already. Using PIp here for uniqueness.
        "Change Threshold": "Low Change Threshold (LCT, 'Anchor')",
        "MiTime Profile": "Process Implementers manage time by rigorously following established protocols. You prefer stable, repeatable workflows, ensuring that every step is executed consistently for predictable outcomes. Your time management ensures smooth, efficient operations.",
        "Time Management Plan": [
            "Standard Operating Procedure (SOP) Adherence: Follow established procedures meticulously, ensuring consistency in execution.",
            "Routine Task Blocks: Schedule regular, recurring time blocks for repetitive tasks to build efficiency and predictability.",
            "Checklist Utilisation: Use checklists to ensure all steps in a process are completed accurately and on time.",
            "Process Improvement Review: Periodically review existing processes for minor, incremental improvements rather than radical changes.",
            "Documentation Maintenance: Allocate time for updating process documentation to ensure it remains accurate and relevant."
        ]
    },
    "Data Protector (DP)": {
        "Change Threshold": "Low Change Threshold (LCT, 'Anchor')",
        "MiTime Profile": "Data Protectors manage time by meticulously safeguarding information and ensuring accuracy. You prefer stable systems for data handling, ensuring every detail is secure and reliable. Your time management focuses on precision and integrity.",
        "Time Management Plan": [
            "Regular Backup Schedules: Implement and adhere to a strict schedule for backing up important data.",
            "Security Protocol Time: Allocate time for reviewing and updating security measures to protect sensitive information.",
            "Data Verification Blocks: Dedicate time to cross-referencing and verifying data accuracy to prevent errors.",
            "Compliance Review: Schedule regular checks to ensure adherence to data protection regulations and internal policies.",
            "Controlled Access Management: Manage permissions and access to information systematically, only granting access when necessary to maintain security."
        ]
    },
    "Methodical Researcher (MR)": {
        "Change Threshold": "Low Change Threshold (LCT, 'Anchor')",
        "MiTime Profile": "Methodical Researchers manage time by systematically exploring and documenting information. You prefer structured investigation, ensuring every piece of data is meticulously categorised and understood for reliable insights. Your time management is about thorough and consistent inquiry.",
        "Time Management Plan": [
            "Structured Research Blocks: Allocate dedicated, uninterrupted time for systematic data collection and literature review.",
            "Categorisation & Indexing: Implement a robust system for organizing research materials, making retrieval efficient.",
            "Incremental Progress: Focus on consistent, daily progress in your research rather than sporadic bursts.",
            "Citation Management: Allocate time for meticulous referencing and citation management to maintain academic integrity.",
            "Peer Review Integration: If applicable, schedule time for structured internal reviews of your research findings before wider dissemination."
        ]
    },
    "Consistent Contributor (CC)": {
        "Change Threshold": "Low Change Threshold (LCT, 'Anchor')",
        "MiTime Profile": "Consistent Contributors manage time by reliably fulfilling their duties and maintaining a steady workflow. You thrive on predictability, ensuring tasks are completed dependably and on schedule. Your time management is about unwavering commitment and steady progress.",
        "Time Management Plan": [
            "Routine-Based Scheduling: Establish a consistent daily and weekly routine and stick to it to ensure steady progress.",
            "Task Checklists: Use checklists to ensure all assigned tasks are completed systematically and nothing is missed.",
            "Dedicated Work Blocks: Allocate specific, uninterrupted time for core tasks to maintain focus and efficiency.",
            "Predictable Communication: Provide regular, scheduled updates on your progress to colleagues or team members.",
            "Buffer for Consistency: Build small buffers into your schedule to account for minor unforeseen interruptions, allowing you to quickly return to your consistent pace."
        ]
    },
    "Norm-Adhering Regulator (NAR)": {
        "Change Threshold": "Low Change Threshold (LCT, 'Anchor')",
        "MiTime Profile": "Norm-Adhering Regulators manage time by ensuring adherence to rules and standards. You prefer stable frameworks, meticulously allocating time to ensure compliance and order. Your time management is about upholding structure and consistency.",
        "Time Management Plan": [
            "Compliance Check Blocks: Schedule dedicated time for reviewing policies, regulations, and ensuring adherence.",
            "Documentation Maintenance: Allocate time for updating and maintaining records and documentation to ensure accuracy and compliance.",
            "Audit Preparation: Build in time for preparing for internal or external audits, ensuring all necessary information is readily available.",
            "Rule Enforcement Sessions: If applicable, schedule time for communicating and reinforcing adherence to established norms.",
            "Controlled Change Implementation: When changes to norms are necessary, plan their integration slowly and methodically, allowing ample time for adaptation and training."
        ]
    }
}

def confirm_action(prompt):
    """Helper function for yes/no confirmation."""
    while True:
        response = input(f"{prompt} (y/n): ").strip().lower()
        if response in ['y', 'yes']:
            return True
        elif response in ['n', 'no']:
            return False
        else:
            print("Invalid input. Please enter 'y' or 'n'.")

def display_mi_type_recommendations(profile_name):
    """Displays the MTra/MiTime recommendations for a given Mi Type profile."""
    profile_data = MI_TYPE_MTRA_RECOMMENDATIONS.get(profile_name)

    if profile_data:
        display_header(f"MiType: {profile_name} - MTra/MiTime Recommendations")
        print(f"**Change Threshold**: {profile_data['Change Threshold']}\n")
        print("**MiTime Profile**:")
        print(f"{profile_data['MiTime Profile']}\n")
        print("**Time Management Plan**:")
        for item in profile_data["Time Management Plan"]:
            print(f"- {item}")
    else:
        print(f"\nMi Type profile '{profile_name}' not found. Please check the name or spelling.")

def main():
    """Main function to run the MiType MTra Recommendations App."""
    print("Welcome to the MiType MTra Recommendations App!")
    print("This app provides personalized time management strategies based on MiType profiles and MTra insights.")
    print("As a queer Maori and biracial man from Otautahi-Christchurch, I understand the need for clear, structured information that allows for ritualistic review. This app aims to provide that for you.")

    while True:
        display_header("Available Mi Type Profiles")
        # Display profiles grouped by Change Threshold for easier navigation
        sorted_profiles = sorted(MI_TYPE_MTRA_RECOMMENDATIONS.keys())
        profiles_by_threshold = {
            "High Change Threshold (HCT, 'Lift')": [],
            "Moderate Change Threshold (MCT, 'Median')": [],
            "Low Change Threshold (LCT, 'Anchor')": []
        }

        # Populate the grouped dictionary
        for profile_name in sorted_profiles:
            threshold = MI_TYPE_MTRA_RECOMMENDATIONS[profile_name]["Change Threshold"]
            if threshold in profiles_by_threshold:
                profiles_by_threshold[threshold].append(profile_name)
            else: # For any unforeseen categories
                if "High Change Threshold" in threshold:
                    profiles_by_threshold["High Change Threshold (HCT, 'Lift')"].append(profile_name)
                elif "Moderate Change Threshold" in threshold:
                    profiles_by_threshold["Moderate Change Threshold (MCT, 'Median')"].append(profile_name)
                elif "Low Change Threshold" in threshold:
                    profiles_by_threshold["Low Change Threshold (LCT, 'Anchor')"].append(profile_name)
                else:
                    print(f"Warning: Profile '{profile_name}' has an unrecognised threshold: {threshold}")


        # Print the grouped profiles with numbers
        profile_list_flat = [] # To map numbers to profile names
        current_number = 1
        for threshold_group in ["High Change Threshold (HCT, 'Lift')", "Moderate Change Threshold (MCT, 'Median')", "Low Change Threshold (LCT, 'Anchor')"]:
            if profiles_by_threshold[threshold_group]:
                print(f"\n--- **{threshold_group}** ---")
                for profile_name in profiles_by_threshold[threshold_group]:
                    print(f"{current_number}. {profile_name}")
                    profile_list_flat.append(profile_name)
                    current_number += 1

        print("\nEnter 'exit' to quit.")

        choice = input("\nEnter the **number** or **full name** of the Mi Type profile you'd like to view: ").strip()

        if choice.lower() == 'exit':
            print("\nExiting the MiType MTra Recommendations App. Kia ora!")
            break

        selected_profile_name = None
        if choice.isdigit():
            try:
                index = int(choice) - 1
                if 0 <= index < len(profile_list_flat):
                    selected_profile_name = profile_list_flat[index]
            except ValueError:
                pass
        else:
            # Try to match by full name (case-insensitive)
            for profile_name in MI_TYPE_MTRA_RECOMMENDATIONS.keys():
                if profile_name.lower() == choice.lower():
                    selected_profile_name = profile_name
                    break

        if selected_profile_name:
            display_mi_type_recommendations(selected_profile_name)
            # Ritualistic pause before returning to menu
            input("\nPress Enter to return to the main menu...")
        else:
            print("\nInvalid selection. Please enter a valid number or full profile name.")
            input("Press Enter to try again...") # Ritualistic pause

if __name__ == "__main__":
    main()