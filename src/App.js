import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';


const bits = [
  { taskName: "Essay", bitName: "intro paragraph", color: "sage" },
  { taskName: "math homework", bitName: "problem 1 & 2", color: "red" },
  { taskName: "problem set", bitName: "part 1", color: "salmon" },
  { taskName: "laundry", bitName: "laundry and this is a super long subtext and it prob", color: "yellow" },
  { taskName: "duolingo", bitName: "1 lesson", color: "green" },
  { taskName: "planet paper", bitName: "research", color: "blue" }
];

const topics = [
  { name: "English", color: "sage", weeklyTime: 240, completedTime: 173 },
  { name: "Math", color: "red", weeklyTime: 360, completedTime: 239 },
  { name: "Chores", color: "yellow", weeklyTime: 120, completedTime: 40 },
  { name: "Astronomy", color: "blue", weeklyTime: 180, completedTime: 20 },
  { name: "CS", color: "salmon", weeklyTime: 400, completedTime: 80 },
  { name: "Spanish", color: "green", weeklyTime: 200, completedTime: 45 }
];

function convertTime(time) {
  const hours = Math.floor(time / 60);
  const minutes = time % 60;

  const hourStr = hours > 0 ? `${hours} hr${hours > 1 ? 's' : ''}` : "";
  const minuteStr = minutes > 0 ? `${minutes} min${minutes > 1 ? 's' : ''}` : "";

  if (!hourStr && !minuteStr) return "0 mins";
  if (hourStr && minuteStr) return `${hourStr} and ${minuteStr}`;
  return hourStr || minuteStr;
}


function convertTimeCharList(time) {
  console.log("time parameter: ", time)
  var hours = (Math.floor(time / 60)).toString();
  var minutes = (time % 60).toString();
  if (minutes.length === 1) {
    minutes+="0";
  }
  if (hours.length === 1) {
    hours="0"+hours;
  }
  console.log("hours: ", hours, " | minutes: ", minutes)
  console.log("convertTimeCharList result: ", hours[0], hours[1], minutes[0], minutes[1] )
  return [hours[0], hours[1], minutes[0], minutes[1]]
}


function App() {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedTColor, setSelectedTColor] = useState("dark");
  const [completionMessage, setCompletionMessage] = useState("");
  const [completedTopicTime, setCompletedTopicTime] = useState([]);
  const [weeklyTopicTime, setWeeklyTopicTime] = useState([]);

  useEffect(() => {
    if (selectedTopic) {
      setSelectedTColor(selectedTopic.color);
      setCompletedTopicTime(convertTimeCharList(selectedTopic.completedTime));
      setWeeklyTopicTime(convertTimeCharList(selectedTopic.weeklyTime))
      console.log("selectedTColor:", selectedTopic.color, "| selectedTopic:", selectedTopic.name);
    } else {
      setSelectedTColor("dark");
    }
  }, [selectedTopic]);




  return (
    <div className="App">
      <div className='main'>
        <div className='adjacent-content'>
          <div className='bar corner'></div>
          <div className='bar top'>
            <img className='logo'
              src='../public/LOGO.png'>
            </img>
          </div>
        </div>

        <div className='adjacent-content'>
          <div className='bar side'>

            <button title ='Click to open GitHub' className='navigator-button'>git</button>
            
            <button title ='Click to open topics' className='navigator-button'>
              <img className='icon'
                src='../public/topic-icon.png'>
              </img>
            </button>

            <button title ='Click to open tasks' className='navigator-button'>
                <img className='icon'
                  src='../public/task-icon.png'>
              </img>
            </button>

            <button title ='Click to open TBA' className='navigator-button'></button>

            <button title ='Click to open settings' className='navigator-button'>
              <img className='icon'
                src='../public/settings-icon.png'>
              </img>
            </button>

            
          </div>


          <div className='content'>
            <div className='block expo'>
              <h1 className='block-heading'><u> GET THINGS DONE, BIT BY BIT</u></h1>

            </div>


            <div className='adjacent-content with-gap'>
              <div className='block task-section'>
                <h1 className='block-heading'><u> TASKS</u></h1>

                <div className="task-gallery">
                  <h1 className='block-heading time-heading'>TODAY</h1>
                  <div style={{ backgroundColor: 'var(--light)', height: "5px", width: "100%" }}></div>

                  {bits.map((bit, index) => (
                    <div
                      key={index}
                      className="task-card"
                      style={{ outline: `2px solid var(--${bit.color})` }}
                    >
                      <h1 className='block-heading card-heading'>{(bit.taskName).toUpperCase()}</h1>
                      <p className='body-text'>{bit.bitName}</p>
                    </div>
                  ))}

                  <h1 className='block-heading time-heading'>TOMORROW</h1>
                  <div style={{ backgroundColor: 'var(--light)', height: "5px", width: "100%" }}></div>

                  {bits.map((bit, index) => (
                    <div
                      key={index}
                      className="task-card"
                      style={{ outline: `2px solid var(--${bit.color})` }}
                    >
                      <h1 className='block-heading card-heading'>{(bit.taskName).toUpperCase()}</h1>
                      <p className='body-text'>{bit.bitName}</p>
                    </div>
                  ))}

                  <h1 className='block-heading time-heading'>LATER</h1>
                  <div style={{ backgroundColor: 'var(--light)', height: "5px", width: "100%" }}></div>

                  {bits.map((bit, index) => (
                    <div
                      key={index}
                      className="task-card"
                      style={{ outline: `2px solid var(--${bit.color})` }}
                    >
                      <h1 className='block-heading card-heading'>{(bit.taskName).toUpperCase()}</h1>
                      <p className='body-text'>{bit.bitName}</p>
                    </div>
                  ))}



                </div>
              </div>


              <div className='adjacent-content  vertical '>

                <div className='block time-section'>
                  <h1 className='block-heading'><u> TIME-KEEPER</u></h1>
                  <div className="adjacent-content">
                    <div className="adjacent-content vertical no-gap" style={{ width: "50%", maxWidth: "200px", justifyContent: "center" }}>

                      <div style={{ display: 'flex', width: "100%", justifyContent: 'center' }}>
                        <select
                          className="dropdown"
                          style={{ border: `3px solid var(--${selectedTColor})` }}
                          onChange={(e) => {
                            const found = topics.find(t => t.name === e.target.value);
                            setSelectedTopic(found || null);
                          }}
                          value={selectedTopic?.name || ""}
                        >
                          <option value="">Select topic.</option>
                          {topics.map(t => (
                            <option key={t.name} value={t.name}>{t.name}</option>
                          ))}
                        </select>


                      </div>

                      {selectedTopic && (
                        <div className='progress-container' style={{ justifyContent: "center" }}>
                          <h1 className='progress-text'>you've completed</h1>
                          <div className='time-container'>
                            <div className='time-box' style={{ backgroundColor: `var(--${selectedTColor})` }}>{completedTopicTime[0]}</div>
                            <div className='time-box' style={{ backgroundColor: `var(--${selectedTColor})` }}>{completedTopicTime[1]}</div>
                            <h1 className='progress-text'>:</h1>
                            <div className='time-box' style={{ backgroundColor: `var(--${selectedTColor})` }}>{completedTopicTime[2]}</div>
                            <div className='time-box' style={{ backgroundColor: `var(--${selectedTColor})` }}>{completedTopicTime[3]}</div>
                          </div>
                          <h1 className='progress-text'>of</h1>
                          <div className='time-container' style={{ gap: "3px", padding: "5px" }}>
                            <div className='time-box' style={{ backgroundColor: `var(--${selectedTColor})` }}>{weeklyTopicTime[0]}</div>
                            <div className='time-box' style={{ backgroundColor: `var(--${selectedTColor})` }}>{weeklyTopicTime[1]}</div>
                            <h1 className='progress-text'>:</h1>
                            <div className='time-box' style={{ backgroundColor: `var(--${selectedTColor})` }}>{weeklyTopicTime[2]}</div>
                            <div className='time-box' style={{ backgroundColor: `var(--${selectedTColor})` }}>{weeklyTopicTime[3]}</div>
                          </div>
                          <h1 className='progress-text'>time this week</h1>
                        </div>
                      )}
                   

                    </div>
                    <div style={{ width: "50%", height: "100px", backgroundColor: "transparent" }}>


                    </div>
                  </div>




                </div>

                <div className='block tba-section'>             </div>


              </div>



            </div>




          </div>

        </div>
      </div>

    </div>
  );
}

export default App;
