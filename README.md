#  GymBuddy - Workout Tracking Mobile App

A React Native mobile application designed to help fitness enthusiasts track their workouts, monitor progress, and achieve their fitness goals. Built with Expo and modern React Native technologies. 
GymBuddy is a feature-rich workout tracking application that empowers users to log exercises, track personal records, monitor body metrics, and visualize their fitness journey through progress photos. The app combines intuitive design with powerful functionality to create a seamless workout tracking experience.

Key Features

### Workout Management
- **Create Custom Workouts**: Build personalized workout routines with multiple exercises
- **Exercise Tracking**: Add sets, reps, and weight for each exercise
- **Workout History**: View all past workouts with detailed exercise breakdowns
- **Edit & Delete**: Modify or remove workouts and exercises as needed
- **Search Functionality**: Quickly find specific workouts using the search bar
- **Completion Tracking**: Mark exercises as completed during workout sessions

### Personal Records (PRs)
- **PR Logging**: Mark and save personal best achievements for any exercise
- **PR History**: View all personal records with date stamps
- **Weight & Rep Tracking**: Track maximum weight lifted and rep combinations

###  Progress Tracking
- **Body Metrics**: Log and monitor weight, age, and gender
- **BMI Calculation**: Automatic BMI calculation with health insights
- **Statistics Dashboard**: View total workouts, PRs, and progress photos at a glance
- **Achievement System**: Unlock badges for reaching workout milestones:
  - First Workout, 10 Workouts, 25 Workouts, 50 Workouts
  - First PR, 10 PRs, 25 PRs
  - Photo Fanatic (10+ progress photos)
  
## Screenshots

###  Authentication

| Landing | Login |
|:-------:|:-----:|
| <img src="https://github.com/user-attachments/assets/1f0271fe-1c99-4c54-878d-434f764a9189" width="200"/> | <img src="https://github.com/user-attachments/assets/7aa8040b-9d45-4b72-8265-69ffaa15a181" width="200"/> |

###  Onboarding
| Gender Selection | Age Selection | Weight Selection |
|:-------:|:-------------:|:-----:|
|  <img src="https://github.com/user-attachments/assets/073464e5-f0b7-4d5a-a706-c80878302df1" width="200"/> | <img src="https://github.com/user-attachments/assets/8f8a55ea-784a-49e0-ae81-e74c8544a38a" width="200"/> | <img src="https://github.com/user-attachments/assets/785cfdc1-532d-4303-95e2-fdeabffa0c3b" width="200"/> |

### Core Features
| Home (Empty) |Home (With Workouts) | Workout Creation | Progress |
|:----:|:-------:|:--------:|:--------:|
| <img src="https://github.com/user-attachments/assets/69e62ab8-be6f-4541-9658-36ddc94dee0d" width="200"/> | <img src="https://github.com/user-attachments/assets/b26bd186-f788-4595-bb15-bd1a8480b418" width="200"/> | <img src="https://github.com/user-attachments/assets/0339f9f2-f900-4685-8dc9-cc7aa7d5701b" width="200"/> | <img src="https://github.com/user-attachments/assets/bcee1630-ee11-429e-821c-8e0d889d39a3" width="200"/> |


### Profile
| Profile | Profile |
|:------------:|:------------:|
| <img src="https://github.com/user-attachments/assets/d7a549c5-854d-4644-9f45-1361f0ae627b" width="200"/> | <img src="https://github.com/user-attachments/assets/83925b2b-0b4d-4e5a-bc48-52ec641fa72d" width="200"/> |

### Settings
| Settings |
|:--------:|
| <img src="https://github.com/user-attachments/assets/f2a47247-9439-4ce8-b2fe-89d268b90c3e" width="200"/> |

###  Progress Photos

- **Photo Library Integration**: Add progress photos directly from device gallery
- **Photo Gallery**: Browse all progress photos within each workout
- **Visual Progress**: Track physical transformation over time

###  Settings & Customization

- **Weight Unit Toggle**: Switch between kg and lbs
- **Default Values**: Set default sets and reps for faster workout creation
- **Clear Data**: Option to reset all workout and profile data
- **Profile Management**: Update personal information anytime

###  User Experience

- **Daily Motivational Quotes**: Rotating inspirational messages to keep you motivated
- **Lottie Animations**: Smooth, engaging animations throughout the app
- **Dark Theme**: Eye-friendly dark interface for all lighting conditions
- **Empty State Messages**: Helpful prompts when no workouts exist
- **Confetti Celebrations**: Visual feedback for achievements

###  Security & Data

- **Secure Authentication**: Login system with email validation
- **Onboarding Flow**: One-time setup for new users
- **Persistent Storage**: Data saved securely across app sessions
- **Session Management**: Secure user session handling


### Form Management & Validation
- **Formik** - Form state management and handling
- **Yup** - Schema-based form validation

### Data Storage

- **AsyncStorage**
  - Stores workout data
  - Saves user preferences
  - Caches application settings
- **Expo Secure Store**
  - Securely stores authentication tokens
  - Protects sensitive user credentials
  - Manages session data

### Media & Images

- **Expo Image Picker** - Camera and photo library access
- **Expo Image** - Optimized image component
