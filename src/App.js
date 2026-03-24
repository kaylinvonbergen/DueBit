import './App.css';
import { useEffect, useState } from 'react';
import Card from './components/card';

const topics = [
  { name: "English", color: "sage", weeklyTime: 240, completedTime: 173 },
  { name: "Math", color: "red", weeklyTime: 360, completedTime: 239 },
  { name: "Chores", color: "yellow", weeklyTime: 120, completedTime: 40 },
  { name: "Astronomy", color: "blue", weeklyTime: 180, completedTime: 20 },
  { name: "CS", color: "salmon", weeklyTime: 400, completedTime: 80 },
  { name: "Spanish", color: "green", weeklyTime: 200, completedTime: 45 }
];

const tasks = [
  {name: "Essay", topic: "English", numBits: 3, complete: false, duedate: "2026-04-01", dueon: "", isLate: false, repeats: ""},
  {name: "Math Homework", topic: "Math", numBits: 2, complete: true, duedate: "2026-04-02", dueon: "", isLate: true, repeats: ""},
  {name: "Laundry", topic: "Chores", numBits: 1, complete: false, duedate: "2026-04-07", dueon: "", isLate: false, repeats: ""},
  {name: "Planet Paper", topic: "Astronomy", numBits: 4, complete: false, duedate: "2026-03-29", isLate: false, repeats: ""},
  {name: "Problem Set", topic: "CS", numBits: 4, complete: false, duedate: "", dueon: "friday" ,isLate: false, repeats: "weekly"},
  {name: "Duolingo", topic: "Spanish", numBits: 1, complete: false, duedate: "", dueon: "daily", isLate: false, repeats: true},
];

const bits = [
  { task: "Essay", description: "intro paragraph", dodate: "2026-03-24", complete: false, isLate: false, color: "sage" },
  { task: "Essay", description: "body paragraph 1", dodate: "2026-03-25", complete: false, isLate: false, color: "sage" },
  { task: "Essay", description: "body paragraph 2", dodate: "2026-03-26", complete: false, isLate: false, color: "sage" },
  { task: "Math Homework", description: "problem 1 & 2", dodate: "2026-03-27", complete: true, isLate: true, color: "red" },
  { task: "Math Homework", description: "problem 3 & 4", dodate: "2026-04-01", complete: true, isLate: true, color: "red" },
  { task: "Laundry", description: "laundry and this is a super long subtext and it prob", dodate: "2026-03-28", complete: false, isLate: false, color: "yellow" },
  { task: "Planet Paper", description: "research", dodate: "2026-03-29", complete: false, isLate: false, color: "blue" },
  { task: "Planet Paper", description: "outline", dodate: "2026-03-30", complete: false, isLate: false, color: "blue" },
  { task: "Planet Paper", description: "first draft", dodate: "2026-03-31", complete: false, isLate: false, color: "blue" },
  { task: "Planet Paper", description: "final draft", dodate: "2026-04-01", complete: false, isLate: false, color: "blue" },
  { task: "Problem Set", description: "part 1", dodate: "2026-03-27", complete: false, isLate: false, color: "salmon" },
  { task: "Problem Set", description: "part 2", dodate: "2026-03-30", complete: false, isLate: false, color: "salmon" },
  { task: "Problem Set", description: "part 3", dodate: "2026-04-02", complete: false, isLate: false, color: "salmon" },
  { task: "Problem Set", description: "part 4", dodate: "2026-04-05", complete: false, isLate: false, color: "salmon" },
  { task: "Duolingo", description: "1 lesson", dodate: "2026-03-24", complete: false, isLate: false, color: "green" },
]


const emptyTopicForm = {
  id: null,
  name: '',
  color: '',
  goalHours: '',
  goalMinutes: '',
};

const emptyTaskForm = {
  id: null,
  name: '',
  topic: '',
  numBits: 1,
  repeats: 'never',   // 'never' | 'daily' | 'weekly'
  dueDate: '',
  dueOn: '',          // for weekly: monday, tuesday, etc. for daily: 'daily'
  bits: [{ description: '', doDate: '' }],
};

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
  const [showTopicsPopup, setShowTopicsPopup] = useState(false);
  const [showTasksPopup, setShowTasksPopup] = useState(false);
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [topicForm, setTopicForm] = useState(emptyTopicForm);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [taskForm, setTaskForm] = useState(emptyTaskForm);


  function handleSelectTopic(topic) {
  setSelectedTopicId(topic.id);

  const totalMinutes = topic.weeklyTime || 0;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  setTopicForm({
    id: topic.id,
    name: topic.name || '',
    color: topic.color || '',
    goalHours: String(hours),
    goalMinutes: String(minutes),
  });
}

function handleCreateNewTopic() {
  setSelectedTopicId('new');
  setTopicForm(emptyTopicForm);
}

function handleTopicFormChange(field, value) {
  setTopicForm((prev) => ({
    ...prev,
    [field]: value,
  }));
}

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

  function handleSelectTask(task) {
  setSelectedTaskId(task.name);

  const matchingBits = bits
    .filter((bit) => bit.task === task.name)
    .map((bit) => ({
      description: bit.description || '',
      doDate: bit.dodate || '',
    }));

  setTaskForm({
    id: task.name,
    name: task.name || '',
    topic: task.topic || '',
    numBits: task.numBits || 1,
    repeats: task.repeats === true ? 'daily' : (task.repeats || 'never'),
    dueDate: task.duedate || '',
    dueOn: task.dueon || '',
    bits: matchingBits.length > 0 ? matchingBits : [{ description: '', doDate: '' }],
  });
}

function handleCreateNewTask() {
  setSelectedTaskId('new');
  setTaskForm({
    ...emptyTaskForm,
    bits: [{ description: '', doDate: '' }],
  });
}

function handleTaskFormChange(field, value) {
  setTaskForm((prev) => ({
    ...prev,
    [field]: value,
  }));
}

function handleRepeatChange(value) {
  setTaskForm((prev) => ({
    ...prev,
    repeats: value,
    dueDate: value === 'never' ? prev.dueDate : '',
    dueOn: value === 'weekly' ? prev.dueOn : value === 'daily' ? 'daily' : '',
    bits: value === 'never'
      ? prev.bits
      : prev.bits.map((bit) => ({ ...bit, doDate: '' })),
  }));
}

function handleNumBitsChange(newCount) {
  const count = Math.max(1, Number(newCount) || 1);

  setTaskForm((prev) => {
    const currentBits = [...prev.bits];

    if (count > currentBits.length) {
      while (currentBits.length < count) {
        currentBits.push({ description: '', doDate: '' });
      }
    } else if (count < currentBits.length) {
      currentBits.length = count;
    }

    return {
      ...prev,
      numBits: count,
      bits: currentBits,
    };
  });
}

function handleBitChange(index, field, value) {
  setTaskForm((prev) => {
    const updatedBits = [...prev.bits];
    updatedBits[index] = {
      ...updatedBits[index],
      [field]: value,
    };

    return {
      ...prev,
      bits: updatedBits,
    };
  });
}

function closeTaskPopup() {
  setShowTasksPopup(false);
  setSelectedTaskId(null);
  setTaskForm(emptyTaskForm);
}

function closeTopicPopup() {  
  setShowTopicsPopup(false);
  setSelectedTopicId(null);
  setTopicForm(emptyTopicForm);
}

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
            
            <button title ='Click to open topics' className='navigator-button' onClick={() => setShowTopicsPopup(true)}>
              <img className='icon'
                src='../public/topic-icon.png'>
              </img>
            </button>

            <button title ='Click to open tasks' className='navigator-button' onClick={() => setShowTasksPopup(true)}>
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
                    <Card
                    key={index}
                    title={bit.task}
                    description={bit.description}
                    color={bit.color}
                  />
                  ))}

                  <h1 className='block-heading time-heading'>TOMORROW</h1>
                  <div style={{ backgroundColor: 'var(--light)', height: "5px", width: "100%" }}></div>

                  {bits.map((bit, index) => (
                    <Card
                      key={index}
                      title={bit.task}
                      description={bit.description}
                      color={bit.color}
                    />
                  ))}

                  <h1 className='block-heading time-heading'>LATER</h1>
                  <div style={{ backgroundColor: 'var(--light)', height: "5px", width: "100%" }}></div>

                  {bits.map((bit, index) => (
                    <Card
                      key={index}
                      title={bit.task}
                      description={bit.description}
                      color={bit.color}
                    />
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
          {showTopicsPopup && (
            <div className="popup-overlay" onClick={() => closeTopicPopup()}>
              <div className="main popup-window" onClick={(e) => e.stopPropagation()}>
                <div className="popup-bar top">
                  <h1 className="popup-title"><u>TOPICS</u></h1>
                </div>

                <button
                  className="popup-close"
                  onClick={() => closeTopicPopup()}
                >
                  ×
                </button>

                <div className="pop-content">
                  <div className="adjacent-content with-gap popup-two-column">
                    <div className="block topics-list">
                      <h1 className="block-heading time-heading centered-heading">Your Topics</h1>

                      
                      <div className="topic-gallery task-gallery">
                        <div onClick={handleCreateNewTopic}>
                          <Card
                            title="+ add new"
                            description=""
                            color="light"
                          />
                        </div>
                        {topics.map((topic, index) => (
                          <div key={index} onClick={() => handleSelectTopic(topic)}>
                            <Card
                              title={topic.name}
                              description=""
                              color={topic.color}
                            />
                          </div>
                        ))}


                      </div>
                    </div>

                    <div className="block create-topic">
                      {selectedTopicId === null ? (
                        <div className="empty-topic-editor">
                          <h1 className="block-heading time-heading centered-heading">Topic Editor</h1>
                          <p className="body-text empty-editor-text">
                            Select a topic on the left to edit it, or click “+ add new” to create one.
                          </p>
                        </div>
                      ) : (
                        <>
                          <h1 className="block-heading time-heading centered-heading">
                            {selectedTopicId === 'new' ? 'Create Topic' : 'Edit Topic'}
                          </h1>

                          <div className="topic-form">
                            <label className="topic-form-label">Topic Name</label>
                            <input
                              className="topic-input"
                              type="text"
                              value={topicForm.name}
                              onChange={(e) => handleTopicFormChange('name', e.target.value)}
                            />

                            <label className="topic-form-label">Topic Color</label>
                            <div className="color-picker">
                              {['red', 'orange', 'yellow', 'green', 'aqua', 'blue', 'magenta'].map((color) => (
                                <button
                                  key={color}
                                  type="button"
                                  className={`color-swatch ${topicForm.color === color ? 'selected' : ''}`}
                                  style={{ backgroundColor: `var(--${color})` }}
                                  onClick={() => handleTopicFormChange('color', color)}
                                />
                              ))}
                            </div>

                            <label className="topic-form-label">Goal Time</label>
                            <div className="goal-time-row">
                              <div className="goal-time-group">
                                <input
                                  className="topic-input small"
                                  type="number"
                                  min="0"
                                  value={topicForm.goalHours}
                                  onChange={(e) => handleTopicFormChange('goalHours', e.target.value)}
                                />
                                <span className="body-text time-label">hours</span>
                              </div>

                              <div className="goal-time-group">
                                <input
                                  className="topic-input small"
                                  type="number"
                                  min="0"
                                  max="59"
                                  value={topicForm.goalMinutes}
                                  onChange={(e) => handleTopicFormChange('goalMinutes', e.target.value)}
                                />
                                <span className="body-text time-label">minutes</span>
                              </div>
                            </div>
                          </div>

                          <button className="done-button">save</button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

           {showTasksPopup && (
            <div className="popup-overlay" onClick={() => closeTaskPopup()}>
              <div className="main popup-window" onClick={(e) => e.stopPropagation()}>
                <div className="popup-bar top">
                  <h1 className="popup-title"><u>TASKS</u></h1>
                </div>

                <button
                  className="popup-close"
                  onClick={() => closeTaskPopup()}
                >
                  ×
                </button>

                <div className="pop-content">
                  <div className="adjacent-content with-gap popup-two-column">
                    <div className="block tasks-list">
                      <h1 className="block-heading time-heading centered-heading">Your Tasks</h1>

                      <div className="task-gallery">
                        <div onClick={handleCreateNewTask}>
                          <Card
                            title="+ add new"
                            description=""
                            color="light"
                          />
                        </div>

                        {tasks.map((task, index) => {
                          const topicColor =
                            topics.find((topic) => topic.name === task.topic)?.color || 'light';

                          return (
                            <div key={index} onClick={() => handleSelectTask(task)}>
                              <Card
                                title={task.name}
                                description={task.topic}
                                color={topicColor}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="block create-task">
                      {selectedTaskId === null ? (
                        <div className="empty-task-editor">
                          <h1 className="block-heading time-heading centered-heading">Task Editor</h1>
                          <p className="body-text empty-editor-text">
                            Select a task on the left to edit it, or click “+ add new” to create one.
                          </p>
                        </div>
                      ) : (
                        <>
                          <h1 className="block-heading time-heading centered-heading">
                            {selectedTaskId === 'new' ? 'Create Task' : 'Edit Task'}
                          </h1>

                          <div className="task-form">
                            <label className="topic-form-label">Task Name</label>
                            <input
                              className="topic-input"
                              type="text"
                              value={taskForm.name}
                              onChange={(e) => handleTaskFormChange('name', e.target.value)}
                            />

                            <label className="topic-form-label">Associated Topic</label>
                            <select
                              className="topic-input"
                              value={taskForm.topic}
                              onChange={(e) => handleTaskFormChange('topic', e.target.value)}
                            >
                              <option value="">Select a topic</option>
                              {topics.map((topic) => (
                                <option key={topic.name} value={topic.name}>
                                  {topic.name}
                                </option>
                              ))}
                            </select>

                            <label className="topic-form-label">Number of Bits</label>
                            <div className="bit-count-row">
                              <button
                                type="button"
                                className="small-adjust-button"
                                onClick={() => handleNumBitsChange(taskForm.numBits - 1)}
                              >
                                -
                              </button>

                              <div className="bit-count-display">{taskForm.numBits}</div>

                              <button
                                type="button"
                                className="small-adjust-button"
                                onClick={() => handleNumBitsChange(taskForm.numBits + 1)}
                              >
                                +
                              </button>
                            </div>

                            <label className="topic-form-label">Repeats</label>
                            <div className="repeat-options">
                              <label className="radio-row">
                                <input
                                  type="radio"
                                  name="repeats"
                                  checked={taskForm.repeats === 'never'}
                                  onChange={() => handleRepeatChange('never')}
                                />
                                Never
                              </label>

                              <label className="radio-row">
                                <input
                                  type="radio"
                                  name="repeats"
                                  checked={taskForm.repeats === 'daily'}
                                  onChange={() => handleRepeatChange('daily')}
                                />
                                Daily
                              </label>

                              <label className="radio-row">
                                <input
                                  type="radio"
                                  name="repeats"
                                  checked={taskForm.repeats === 'weekly'}
                                  onChange={() => handleRepeatChange('weekly')}
                                />
                                Weekly
                              </label>
                            </div>

                            {taskForm.repeats === 'never' && (
                              <>
                                <label className="topic-form-label">Due Date</label>
                                <input
                                  className="topic-input"
                                  type="date"
                                  value={taskForm.dueDate}
                                  onChange={(e) => handleTaskFormChange('dueDate', e.target.value)}
                                />
                              </>
                            )}

                            {taskForm.repeats === 'daily' && (
                              <>
                                <label className="topic-form-label">Due</label>
                                <div className="repeat-static-text">Every day</div>
                              </>
                            )}

                            {taskForm.repeats === 'weekly' && (
                              <>
                                <label className="topic-form-label">Due On</label>
                                <select
                                  className="topic-input"
                                  value={taskForm.dueOn}
                                  onChange={(e) => handleTaskFormChange('dueOn', e.target.value)}
                                >
                                  <option value="">Select a day</option>
                                  <option value="monday">Monday</option>
                                  <option value="tuesday">Tuesday</option>
                                  <option value="wednesday">Wednesday</option>
                                  <option value="thursday">Thursday</option>
                                  <option value="friday">Friday</option>
                                  <option value="saturday">Saturday</option>
                                  <option value="sunday">Sunday</option>
                                </select>
                              </>
                            )}

                            <label className="topic-form-label">Bits</label>
                            <div className="editable-bits-list">
                              {taskForm.bits.map((bit, index) => (
                                <div key={index} className="editable-bit-card">
                                  <input
                                    className="topic-input"
                                    type="text"
                                    placeholder={`Bit ${index + 1} description`}
                                    value={bit.description}
                                    onChange={(e) => handleBitChange(index, 'description', e.target.value)}
                                  />

                                  {taskForm.repeats === 'never' ? (
                                    <input
                                      className="topic-input"
                                      type="date"
                                      value={bit.doDate}
                                      onChange={(e) => handleBitChange(index, 'doDate', e.target.value)}
                                    />
                                  ) : (
                                    <div className="repeat-static-text">No DO date for repeating tasks</div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          <button className="done-button">save</button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}


      </div>

    </div>

    
  );
}

export default App;
