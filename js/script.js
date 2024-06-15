// This should be separate
var workoutDatabase = [
    { target: 'back', name: 'Forward Fold', description: 'Sit up straight\n Slowly hinge forward at your hips, reach your hands towards the floor\n Hold for 15, feeling a stretch in your lower back and hamstrings\n Avoid rounding your back\n' },
    { target: 'back', name: 'Cat-Cow Stretch', description: 'Sit up straight with your feet flat\n Inhale and arch your back, bring your chest forward and shoulders back (Cow pose)\n Exhale and round your back, tuck your chin to your chest and bring your belly button towards your spine (Cat pose)\n' },
    { target: 'back', name: 'Figure-Four Stretch', description: 'Sit up straight\n Cross your right ankle over your left knee, creating a figure-four shape with your legs\n Gently press down on your right knee to deepen the stretch\n Hold for 15 seconds, then switch legs\n Keep your spine tall and your shoulders relaxed\n' },
    { target: 'back', name: 'Side Stretch', description: 'Sit up straight with your feet flat\n Extend your right arm overhead and lean gently to the left, keep your hips grounded\n Hold for 15 seconds, then switch sides\n Keep your shoulders relaxed and avoid collapsing into the stretch\n' },
    { target: 'back', name: 'Spinal Twist', description: 'Sit up straight with your feet flat, then twist your torso to the right, place your left hand on the outside of your right knee and your right hand on the back of the chair\n Hold the twist for 15 seconds, then switch sides\n Keep your spine tall and your shoulders relaxed\n' },
    { targets: ['back', 'shoulder'], name: 'Upper Back Stretch', description: 'Sit up straight and interlace your fingers in front of you, palms facing away\n Extend your arms forward, round your upper back and bring your chin towards your chest\n Hold for 15 seconds, breathe deeply into the stretch\n Avoid hunching your shoulders\n' },
    { target: 'back', name: 'Chest Opener', description: 'Sit up straight in your chair with your feet flat\n Clasp your hands behind your back and straighten your arms\n Squeeze your shoulder blades together and lift your chest towards the ceiling\n Hold for 15 seconds\n Keep your chin parallel to the floor and avoid overarching\n' },
    { targets: ['back', 'shoulder'], name: 'Shoulder Blade Squeeze', description: 'Sit up straight in your chair with your feet flat on the floor\n Roll your shoulders back and down, squeezing your shoulder blades together\n Hold for 5-10 seconds, then release\n Repeat for 8-10 repetitions to help improve posture and alleviate tension in the upper back\n' },
    { target: 'shoulder', name: 'Desk Shoulder Shrug', description: 'Sit up straight in your chair with your feet flat\n Inhale deeply and as you exhale, shrug your shoulders up towards your ears and hold for 3 seconds, then release and lower your shoulders back down\n Repeat for 10 repetitions\n' },
    { target: 'shoulder', name: 'Wrist and Finger Stretches', description: 'Extend your right arm in front of you with the palm facing down\n Use your left hand to gently press down on the fingers of your right hand\n Hold the stretch for 15, then release and switch to the other hand\n Repeat with your left hand\n' },
];

// We want to split things into small functions that just do one thing.
// I've started splitting up generateWorkout into smaller functions.

// We can make all the 'getElementById' variables global since we should only get them once, 
// Not every time the function is called
const tooltipContainer = document.getElementById('tooltip-container');
const timeInput        = document.getElementById('time');
const tensionInput      = document.getElementById('tension') 
const workoutContainer = document.getElementById('workout-container');
const tooltipDiv       = document.querySelector('.tooltip-pointer');


// Avoid using var, use let or const instead.
// https://www.freecodecamp.org/news/var-let-and-const-whats-the-difference/


function getTimeAndTensionArea() {
    // Get the time and tension area
    const timeValue = parseInt(timeInput.value);
    const tensionInputValue = tensionInput.value.toLowerCase(); 

    if (isNaN(timeValue) || timeValue < 1) {
        // customAlert('Please enter 1-5 minutes');
        // Just use a normal alert for now
        alert("Please enter 1-5 minutes")
    } else if (tensionInputValue.trim() === '') {
        // customAlert('Please specify the tension area');
        alert("Please specify the tension area")
    }


    return [timeValue, tensionInputValue]
}


function generateWorkout() {
    const [timeInput, tensionInput] = getTimeAndTensionArea()

    if (!timeInput || !tensionInput) 
        return;

    // Clear previous workouts
    workoutContainer.innerHTML = '';

    let availableWorkouts = workoutDatabase.slice();

    // Generate workouts based on time input and tension area
    for (let i = 0; i < timeInput; i++) {
        // Filter workouts based on target area
        let filteredWorkouts = availableWorkouts.filter(function(workout) {
            // GPT? :P
            if (Array.isArray(workout.targets)) {
                return workout.targets.some(function(target) {
                    return target.toLowerCase() === tensionInput;
                });
            } else {
                return workout.target.toLowerCase() === tensionInput;
            }
        });

        if (filteredWorkouts.length === 0) {
            alert('No workouts found for the specified tension area.');
            return;
        }

        // Choose a random workout from the filtered list
        let randomIndex = Math.floor(Math.random() * filteredWorkouts.length);
        let workout = filteredWorkouts[randomIndex];

        // Remove the chosen workout from availableWorkouts
        availableWorkouts.splice(availableWorkouts.indexOf(workout), 1);

        let workoutElement = document.createElement('div');
        workoutElement.className = 'workout';
        workoutElement.textContent = workout.name;
        workoutElement.setAttribute('data-description', workout.description);

        workoutContainer.appendChild(workoutElement);

        // Trigger fade-in effect using closure
        (function(element, delay) {
            setTimeout(function() {
                element.style.opacity = 1;
            }, delay);
        })(workoutElement, i * 100); // Adjust timing as needed
    }

    tooltipDiv.classList.remove('hidden');

    // Trigger tooltip fade-in effect
    setTimeout(function() {
        tooltipDiv.style.opacity = 1;
    }, 100); // Adjust timing as needed

    var workoutElements = document.querySelectorAll('.workout');
    workoutElements.forEach(function(workoutElement) {
        workoutElement.addEventListener('mouseover', handleMouseover);
        workoutElement.addEventListener('mouseout', handleMouseout);
    });
}

// Function to handle mouseout event on workout elements
function handleMouseout() {
    tooltipContainer.style.display = 'none';
}


document.addEventListener('mouseover', function(event) {
    const workout = document.querySelector('.workout');

    // Make sure workout exists
    if (!workout)
        return;

    if (!workout.contains(event.target)) {
        workout.classList.remove('hovered');
    }
});


function handleMouseover(event) {
    const workout = event.target;
    workout.classList.add('hovered');
    workout.addEventListener('click', handleDescriptionClick);
}


function shuffleInputs() {
    // Generate random time between 1 and 5
    const randomTime = Math.floor(Math.random() * 5) + 1;
    timeInput.value = randomTime;

    // Manually specify tension areas
    const tensionInputs = ['back', 'shoulder'];
    
    // Select a random tension area
    const randomIndex = Math.floor(Math.random() * tensionInputs.length);
    const randomTensionArea = tensionInputs[randomIndex];
    tensionInput.value = randomTensionArea || "";
    
    // Generate workout on shuffle
    generateWorkout();
}


function handleDescriptionClick(event) {
    const workout = event.target;
    let description = workout.getAttribute('data-description');
    
    // Replace \n with <br> for line breaks and add margin-bottom
    description = description.replace(/\n/g, '<br><br style="margin-bottom: 0.001rem;">');
    
    tooltipContainer.innerHTML = description;
    tooltipContainer.style.display = 'block';
    
    // Remove the click event listener after revealing the description
    workout.removeEventListener('click', handleDescriptionClick);
}


// #customAlert doesn't exist
function customAlert(message) {
    const modal = document.getElementById("customAlert");
    const alertMessage = document.getElementById("alertMessage");
    alertMessage.innerHTML = message;
    modal.style.display = "flex";

    const span = document.getElementsByClassName("close")[0];
    span.onclick = function() {
      modal.style.display = "none";
    }

    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
}


function toggleLightMode() {
    console.log("Dark mode toggled"); 
    const body = document.querySelector('body');
    body.classList.toggle('dark-mode');
}