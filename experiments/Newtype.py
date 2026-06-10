# mitype_info_app.py

def display_header(title):
    """Prints a formatted header for sections."""
    print(f"\n{'=' * 30}")
    print(f" {title.upper()} ")
    print(f"{'=' * 30}")

def display_section(section_name):
    """Displays information for a given section."""
    if section_name.lower() == "overview":
        display_header("MiType+ & Mi Type Learning System Overview")
        print("Unlock Your Full Potential with MiType+!")
        print("The MiType+ Assessment is an upgrade to our self-understanding framework, integrating the Mi Type Resilience Assessment (MTra) for a comprehensive profile.")
        print("\nMi Type Learning System (MTLS): A roadmap for self-understanding, conscious communication, and personal growth.")
        print("MTLS integrates psychological and cognitive models to understand human behavior and communication patterns.")

    elif section_name.lower() == "mitype+":
        display_header("About MiType+")
        print("Introducing MiType+ - The Assessment Just Got Smarter!")
        print("This assessment provides a deeper, more actionable understanding of your inner world and how you thrive.")
        print("\nComplete Integration:")
        print("MiType+ fully integrates the Mi Type Resilience Assessment (MTra), completing your comprehensive MiType+ profile.")
        print("This holistic approach provides insight into your cognitive patterns, emotional responses, and adaptive capabilities.")
        print("\nWhat you'll discover with the full MiType+ Assessment:")
        print("- Your Core Cognitive and Personality Preferences")
        print("- Your Specific Change Threshold")
        print("- Your Highertends (evolved strengths)")
        print("- Your Egotends (potential pitfalls)")

    elif section_name.lower() == "mtra":
        display_header("Mi Type Resilience Assessment (MTra)")
        print("Your mind is a busy place, constantly processing thoughts, emotions, and external stimuli. We call this 'mind traffic.'")
        print("The MTra assesses how effectively you navigate this traffic by measuring three crucial dimensions of your resilience:")
        print("  - Stress Factors (SF): Understand internal considerations contributing to perceived stress.")
        print("  - Trigger Responses (TR): Gain insight into intensity and frequency of emotional reactions.")
        print("  - Emotional Regulation (ER): Discover your innate ability to manage, adapt, and return to a balanced emotional state.")
        print("\nYour Change Threshold:")
        print("By understanding your MTra scores, you'll gain insights into your Change Threshold:")
        print("  - Lift: Thrive in dynamic transformation, embrace change.")
        print("  - Median: Find balance in adaptation, navigate change with measured responses.")
        print("  - Anchor: Provide stability and consistency, prefer structured environments.")

    elif section_name.lower() == "mtls_system_overview":
        display_header("MTLS System Overview")
        print("The Mi Type Learning System consists of three interconnected components:")
        print("1. Mi Type Profiles: 24 distinct cognitive patterns revealing natural tendencies, strengths, and growth areas.")
        print("2. Change Threshold System (CTS): Categorizes Mi Types into Lifts (high change), Medians (moderate change), and Anchors (low change).")
        print("3. Tonal Flow Mapping (TFM): A Python-based communication tool analyzing emotional sentiment of written text without AI/LLMs.")
        print("\nHow These Components Work Together:")
        print("  - Self-Understanding: Mi Type profile, Change Threshold, and TFM show communication tendencies.")
        print("  - Interpersonal Dynamics: Adapt communication using Tonal Flow principles to build stronger connections.")
        print("  - Growth and Development: Develop targeted strategies for personal and professional growth.")

    elif section_name.lower() == "mi_type_profiles":
        display_header("The 24 Mi Type Profiles")
        print("Each Mi Type profile represents a unique cognitive pattern, categorized by their Change Threshold:")
        print("\nHigh Change Threshold (HCT, 'Lift'):")
        print("  - IE: Imaginative Explorer")
        print("  - TL: Transformational Leader")
        print("  - ID: Innovative Designer")
        print("  - CPS: Creative Problem Solver")
        print("  - VC: Visionary Conceptualiser")
        print("  - PA: Passionate Advocate")
        print("\nModerate Change Threshold (MCT, 'Median'):")
        print("  - HI: Holistic Integrator")
        print("  - RB: Relationship Builder")
        print("  - PC: Personalised Coach")
        print("  - EC: Expressive Communicator")
        print("  - MP: Methodical Producer")
        print("  - SP: Strategic Planner")
        print("\nLow Change Threshold (LCT, 'Anchor'):")
        print("  - DO: Detailed Organiser")
        print("  - RE: Reliable Executor")
        print("  - (Note: The provided text only listed two Anchors. There might be more in the full system.)")

    elif section_name.lower() == "benefits":
        display_header("Benefits & Real-World Impact")
        print("MiType+ and MTLS offer powerful insights and practical applications, leading to:")
        print("  - Enhanced Communication: Develop strategies that resonate with different individuals.")
        print("  - Improved Performance: Leverage natural strengths, manage stress, overcome obstacles.")
        print("  - Greater Resilience: Develop targeted support strategies to navigate challenges.")
        print("  - Authentic Growth: Honor unique cognitive patterns for meaningful development.")

    elif section_name.lower() == "applications":
        display_header("Applications")
        print("MiType+ for Professionals:")
        print("  - For Educators: Understand diverse learning styles, create inclusive environments.")
        print("  - For Facilitators: Design effective workshops, navigate group dynamics, create safe spaces.")
        print("  - For Employers: Build balanced teams, improve engagement, develop leadership, honor cognitive diversity.")
        print("\nMi Type Learning System Applications:")
        print("  - Personal Development: Gain self-awareness, identify growth opportunities.")
        print("  - Relationships: Improve communication, build deeper connections, navigate conflicts.")
        print("  - Professional Growth: Enhance leadership, improve team dynamics, align career choices.")
        print("  - Team Dynamics: Build effective teams, improve collaboration, optimize role assignments.")
        print("  - Mental Wellbeing: Understand stress responses, develop resilience, create coping strategies.")
        print("  - Organisational Development: Enhance culture, improve leadership, tailored change management.")
        print("\nIndustry Applications: Adaptable to Any Industry.")
        print("  - Core Benefits: Enhanced communication, improved team dynamics, effective leadership, reduced conflict, strategic talent development.")
        print("  - Examples: Corporate & Finance, Healthcare, Education, Technology & Innovation, Government & Public Service, Non-Profit & NGOs.")

    elif section_name.lower() == "contact":
        display_header("Contact Us")
        print("Ready to Gain Unparalleled Insight? Discover your complete MiType+ profile.")
        print("Email: jordaniel@icloud.com")
        print("Phone: +64 22 420 4654")
        print("Location: Invercargill, New Zealand")
        print("\nReach out today to discover how MiType+ can transform your personal and professional life.")

    elif section_name.lower() == "about_me":
        display_header("About Me (User Information)")
        print("This section reflects some information you've shared:")
        print("- 38 year old queer Maori and biracial man.")
        print("- Lives in Otautahi-Christchurch, Aotearoa, New Zealand.")
        print("- Has epilepsy and daily absence seizures; sees static and sometimes sounds.")
        print("- Undiagnosed autistic (younger brother is Asperger's).")
        print("- Prefers short, concise responses.")
        print("- Does not like being rushed; needs time to regulate between environments.")
        print("\n(This information is included to demonstrate how shared preferences can be acknowledged.)")

    else:
        print("\nInvalid section. Please choose from: overview, mitype+, mtra, mtls_system_overview, mi_type_profiles, benefits, applications, contact, about_me")

def main():
    """Main function to run the MiType Information App."""
    print("Welcome to the MiType Information App!")
    print("This app provides details on MiType+ and the Mi Type Learning System.")
    print("You can explore different aspects of the system at your own pace.")

    while True:
        print("\n--- Main Menu ---")
        print("Available sections:")
        print("  - Overview (mitype+ & MTLS summary)")
        print("  - MiType+ (details about the MiType+ assessment)")
        print("  - MTra (Mi Type Resilience Assessment details)")
        print("  - MTLS System Overview (components of the MTLS)")
        print("  - Mi Type Profiles (the 24 profiles and Change Thresholds)")
        print("  - Benefits (impact and advantages)")
        print("  - Applications (for professionals and various contexts)")
        print("  - Contact (contact information)")
        print("  - About Me (acknowledgement of your shared information)")
        print("  - Exit (to quit the application)")

        choice = input("\nEnter the section you'd like to view: ").strip().lower()

        if choice == "exit":
            print("Exiting the MiType Information App. Kia ora!")
            break
        else:
            display_section(choice)
            # This pause allows for regulation before returning to the menu.
            input("\nPress Enter to return to the main menu...")

if __name__ == "__main__":
    main()