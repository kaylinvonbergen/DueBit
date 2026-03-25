import './App.css';
import { useEffect, useMemo, useState } from 'react';
import Card from './components/card';
import logo from './assets/LOGO.png';
import topicIcon from './assets/topic-icon.png';
import taskIcon from './assets/task-icon.png';
import settingsIcon from './assets/settings-icon.png';


const emptyTopicForm = {
  id: null,
  name: '',
  color: 'red',
  goalHours: '',
  goalMinutes: '',
};

const emptyTaskForm = {
  id: null,
  name: '',
  topicId: '',
  numBits: 1,
  repeats: 'never',
  dueDate: '',
  dueOn: '',
  bits: [{ description: '', doDate: '' }],
};

function convertTimeCharList(time) {
  const safeTime = Number(time) || 0;
  let hours = Math.floor(safeTime / 60).toString();
  let minutes = (safeTime % 60).toString();

  if (minutes.length === 1) {
     minutes = '0' + minutes;
  }
  if (hours.length === 1) {
    hours = '0' + hours;
  }

  return [hours[0], hours[1], minutes[0], minutes[1]];
}

function App() {
  const [selectedTimeTopicId, setSelectedTimeTopicId] = useState('');
  const [selectedTColor, setSelectedTColor] = useState('dark');
  const [completedTopicTime, setCompletedTopicTime] = useState([]);
  const [weeklyTopicTime, setWeeklyTopicTime] = useState([]);

  const [showTopicsPopup, setShowTopicsPopup] = useState(false);
  const [showTasksPopup, setShowTasksPopup] = useState(false);
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);

  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [topicForm, setTopicForm] = useState(emptyTopicForm);

  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [taskForm, setTaskForm] = useState(emptyTaskForm);

  const [topics, setTopics] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [bits, setBits] = useState([]);

  const selectedTimeTopic = useMemo(
    () => topics.find((topic) => String(topic.id) === String(selectedTimeTopicId)) || null,
    [topics, selectedTimeTopicId]
  );

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    if (selectedTimeTopic) {
      setSelectedTColor(selectedTimeTopic.color || 'dark');
      setCompletedTopicTime(convertTimeCharList(selectedTimeTopic.completedTime || 0));
      setWeeklyTopicTime(convertTimeCharList(selectedTimeTopic.weeklyTime || 0));
    } else {
      setSelectedTColor('dark');
      setCompletedTopicTime([]);
      setWeeklyTopicTime([]);
    }
  }, [selectedTimeTopic]);

async function loadAllData() {
  try {
    if (!window.duebit) {
      console.error('DueBit Electron API is not available.');
      return;
    }

    const dbTopics = await window.duebit.topics.getAll();

    const mappedTopics = dbTopics.map((topic) => ({
      id: topic.id,
      name: topic.name,
      color: topic.color,
      weeklyTime: topic.weekly_time_goal,
      completedTime: 0,
    }));

    setTopics(mappedTopics);

    const dbTasks = await window.duebit.tasks.getAll();

    const mappedTasks = dbTasks.map((task) => ({
      id: task.id,
      name: task.name,
      topicId: task.topic_id ?? null,
      topicName: task.topic_name || '',
      topicColor: task.topic_color || 'light',
      numBits: task.num_bits ?? 1,
      complete: Boolean(task.complete),
      duedate: task.due_datetime || '',
      dueon: task.due_on || '',
      isLate: false,
      repeats: task.repeats || 'never',
    }));

    setTasks(mappedTasks);

    const allBits = [];

    for (const task of dbTasks) {
      const taskBits = await window.duebit.bits.getByTaskId(task.id);

      const taskColor =
        dbTopics.find((topic) => topic.id === task.topic_id)?.color || 'light';

      const mappedBits = taskBits.map((bit) => ({
        id: bit.id,
        taskId: bit.task_id,
        task: task.name,
        description: bit.description,
        dodate: bit.do_date || '',
        complete: Boolean(bit.complete),
        isLate: false,
        color: taskColor,
      }));

      allBits.push(...mappedBits);
    }

    setBits(allBits);
  } catch (error) {
    console.error('Failed to load app data:', error);
  }
}

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

  async function handleSaveTopic() {
    console.log('Save topic clicked', topicForm);
    try {
      const totalMinutes =
        (Number(topicForm.goalHours) || 0) * 60 +
        (Number(topicForm.goalMinutes) || 0);

      const payload = {
        name: topicForm.name.trim(),
        color: topicForm.color,
        weeklyTimeGoal: totalMinutes,
      };

      if (!payload.name || !payload.color) {
        console.error('Topic name and color are required.');
        return;
      }

      if (selectedTopicId === 'new') {
        await window.duebit.topics.create(payload);
      } else {
        await window.duebit.topics.update({
          id: topicForm.id,
          ...payload,
        });
      }

      await loadAllData();
      closeTopicPopup();
    } catch (error) {
      console.error('Failed to save topic:', error);
      alert(error?.message || 'Failed to save topic.');
    }
  }

  function handleSelectTask(task) {
    setSelectedTaskId(task.id);

    const matchingBits = bits
      .filter((bit) => bit.taskId === task.id)
      .sort((a, b) => {
        const aDate = a.dodate || '';
        const bDate = b.dodate || '';
        return aDate.localeCompare(bDate);
      })
      .map((bit) => ({
        description: bit.description || '',
        doDate: bit.dodate || '',
      }));

    setTaskForm({
      id: task.id,
      name: task.name || '',
      topicId: task.topicId ?? '',
      numBits: task.numBits || 1,
      repeats: task.repeats || 'never',
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
      bits:
        value === 'never'
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

  async function handleSaveTask() {
    try {
      const payload = {
        name: taskForm.name.trim(),
        topicId: taskForm.topicId ? Number(taskForm.topicId) : null,
        numBits: taskForm.numBits,
        repeats: taskForm.repeats,
        dueDateTime: taskForm.repeats === 'never' ? taskForm.dueDate : '',
        dueOn: taskForm.repeats === 'weekly' ? taskForm.dueOn : '',
        bits: taskForm.bits.map((bit, index) => ({
          description: bit.description.trim(),
          doDate: taskForm.repeats === 'never' ? bit.doDate : '',
          sortOrder: index,
        })),
      };

      if (!payload.name) {
        console.error('Task name is required.');
        return;
      }

      if (selectedTaskId === 'new') {
        await window.duebit.tasks.create(payload);
      } else {
        await window.duebit.tasks.update({
          id: taskForm.id,
          ...payload,
        });
      }

      await loadAllData();
      closeTaskPopup();
    } catch (error) {
      console.error('Failed to save task:', error);
    }
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
      <div className="main">
        <div className="adjacent-content">
          <div className="bar corner"></div>
          <div className="bar top">
            <img className="logo" src={logo} alt="DueBit logo" />
          </div>
        </div>

        <div className="adjacent-content">
          <div className="bar side">
            <button title="Click to open GitHub" className="navigator-button">
              git
            </button>

            <button
              title="Click to open topics"
              className="navigator-button"
              onClick={() => setShowTopicsPopup(true)}
            >
              <img className="icon" src={topicIcon} alt="Topics" />
            </button>

            <button
              title="Click to open tasks"
              className="navigator-button"
              onClick={() => setShowTasksPopup(true)}
            >
              <img className="icon" src={taskIcon} alt="Tasks" />
            </button>

            <button title="Click to open TBA" className="navigator-button"></button>

            <button
              title="Click to open settings"
              className="navigator-button"
              onClick={() => setShowSettingsPopup(true)}
            >
              <img className="icon" src={settingsIcon} alt="Settings" />
            </button>
          </div>

          <div className="content">
            <div className="block expo">
              <h1 className="block-heading">
                <u> GET THINGS DONE, BIT BY BIT</u>
              </h1>
            </div>

            <div className="adjacent-content with-gap">
              <div className="block task-section">
                <h1 className="block-heading">
                  <u> TASKS</u>
                </h1>

                <div className="task-gallery">
                  <h1 className="block-heading time-heading">TODAY</h1>
                  <div
                    style={{
                      backgroundColor: 'var(--light)',
                      height: '5px',
                      width: '100%',
                    }}
                  ></div>

                  {bits.map((bit) => (
                    <Card
                      key={`today-${bit.id}`}
                      title={bit.task}
                      description={bit.description}
                      color={bit.color}
                    />
                  ))}

                  <h1 className="block-heading time-heading">TOMORROW</h1>
                  <div
                    style={{
                      backgroundColor: 'var(--light)',
                      height: '5px',
                      width: '100%',
                    }}
                  ></div>

                  {bits.map((bit) => (
                    <Card
                      key={`tomorrow-${bit.id}`}
                      title={bit.task}
                      description={bit.description}
                      color={bit.color}
                    />
                  ))}

                  <h1 className="block-heading time-heading">LATER</h1>
                  <div
                    style={{
                      backgroundColor: 'var(--light)',
                      height: '5px',
                      width: '100%',
                    }}
                  ></div>

                  {bits.map((bit) => (
                    <Card
                      key={`later-${bit.id}`}
                      title={bit.task}
                      description={bit.description}
                      color={bit.color}
                    />
                  ))}
                </div>
              </div>

              <div className="adjacent-content vertical">
                <div className="block time-section">
                  <h1 className="block-heading">
                    <u> TIME-KEEPER</u>
                  </h1>

                  <div className="adjacent-content">
                    <div
                      className="adjacent-content vertical no-gap"
                      style={{ width: '50%', maxWidth: '200px', justifyContent: 'center' }}
                    >
                      <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
                        <select
                          className="dropdown"
                          style={{ border: `3px solid var(--${selectedTColor})` }}
                          onChange={(e) => setSelectedTimeTopicId(e.target.value)}
                          value={selectedTimeTopicId}
                        >
                          <option value="">Select topic.</option>
                          {topics.map((topic) => (
                            <option key={topic.id} value={topic.id}>
                              {topic.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {selectedTimeTopic && (
                        <div className="progress-container" style={{ justifyContent: 'center' }}>
                          <h1 className="progress-text">you've completed</h1>

                          <div className="time-container">
                            <div
                              className="time-box"
                              style={{ backgroundColor: `var(--${selectedTColor})` }}
                            >
                              {completedTopicTime[0]}
                            </div>
                            <div
                              className="time-box"
                              style={{ backgroundColor: `var(--${selectedTColor})` }}
                            >
                              {completedTopicTime[1]}
                            </div>
                            <h1 className="progress-text">:</h1>
                            <div
                              className="time-box"
                              style={{ backgroundColor: `var(--${selectedTColor})` }}
                            >
                              {completedTopicTime[2]}
                            </div>
                            <div
                              className="time-box"
                              style={{ backgroundColor: `var(--${selectedTColor})` }}
                            >
                              {completedTopicTime[3]}
                            </div>
                          </div>

                          <h1 className="progress-text">of</h1>

                          <div className="time-container" style={{ gap: '3px', padding: '5px' }}>
                            <div
                              className="time-box"
                              style={{ backgroundColor: `var(--${selectedTColor})` }}
                            >
                              {weeklyTopicTime[0]}
                            </div>
                            <div
                              className="time-box"
                              style={{ backgroundColor: `var(--${selectedTColor})` }}
                            >
                              {weeklyTopicTime[1]}
                            </div>
                            <h1 className="progress-text">:</h1>
                            <div
                              className="time-box"
                              style={{ backgroundColor: `var(--${selectedTColor})` }}
                            >
                              {weeklyTopicTime[2]}
                            </div>
                            <div
                              className="time-box"
                              style={{ backgroundColor: `var(--${selectedTColor})` }}
                            >
                              {weeklyTopicTime[3]}
                            </div>
                          </div>

                          <h1 className="progress-text">time this week</h1>
                        </div>
                      )}
                    </div>

                    <div
                      style={{
                        width: '50%',
                        height: '100px',
                        backgroundColor: 'transparent',
                      }}
                    ></div>
                  </div>
                </div>

                <div className="block tba-section"></div>
              </div>
            </div>
          </div>
        </div>

        {showTopicsPopup && (
          <div className="popup-overlay" onClick={closeTopicPopup}>
            <div className="main popup-window" onClick={(e) => e.stopPropagation()}>
              <div className="popup-bar top">
                <h1 className="popup-title">
                  <u>TOPICS</u>
                </h1>
              </div>

              <button className="popup-close" onClick={closeTopicPopup}>
                ×
              </button>

              <div className="pop-content">
                <div className="adjacent-content with-gap popup-two-column">
                  <div className="block topics-list">
                    <h1 className="block-heading time-heading centered-heading">Your Topics</h1>

                    <div className="topic-gallery task-gallery">
                      <div onClick={handleCreateNewTopic}>
                        <Card title="+ add new" description="" color="light" />
                      </div>

                      {topics.map((topic) => (
                        <div key={topic.id} onClick={() => handleSelectTopic(topic)}>
                          <Card title={topic.name} description="" color={topic.color} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="block create-topic">
                    {selectedTopicId === null ? (
                      <div className="empty-topic-editor">
                        <h1 className="block-heading time-heading centered-heading">Topic Editor</h1>
                        <p className="body-text empty-editor-text">
                          Select a topic on the left to edit it, or click “+ add new” to create
                          one.
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
                            {['red', 'orange', 'yellow', 'green', 'aqua', 'blue', 'magenta'].map(
                              (color) => (
                                <button
                                  key={color}
                                  type="button"
                                  className={`color-swatch ${
                                    topicForm.color === color ? 'selected' : ''
                                  }`}
                                  style={{ backgroundColor: `var(--${color})` }}
                                  onClick={() => handleTopicFormChange('color', color)}
                                />
                              )
                            )}
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
                                onChange={(e) =>
                                  handleTopicFormChange('goalMinutes', e.target.value)
                                }
                              />
                              <span className="body-text time-label">minutes</span>
                            </div>
                          </div>
                        </div>

                        <button className="done-button" onClick={handleSaveTopic}>
                          save
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showTasksPopup && (
          <div className="popup-overlay" onClick={closeTaskPopup}>
            <div className="main popup-window" onClick={(e) => e.stopPropagation()}>
              <div className="popup-bar top">
                <h1 className="popup-title">
                  <u>TASKS</u>
                </h1>
              </div>

              <button className="popup-close" onClick={closeTaskPopup}>
                ×
              </button>

              <div className="pop-content">
                <div className="adjacent-content with-gap popup-two-column">
                  <div className="block topics-list">
                    <h1 className="block-heading time-heading centered-heading">Your Tasks</h1>

                    <div className="topic-gallery task-gallery">
                      <div onClick={handleCreateNewTask}>
                        <Card title="+ add new" description="" color="light" />
                      </div>

                      {tasks.map((task) => (
                        <div key={task.id} onClick={() => handleSelectTask(task)}>
                          <Card
                            title={task.name}
                            description={task.topicName}
                            color={task.topicColor || 'light'}
                          />
                        </div>
                      ))}
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
                            value={taskForm.topicId}
                            onChange={(e) => handleTaskFormChange('topicId', e.target.value)}
                          >
                            <option value="">Select a topic</option>
                            {topics.map((topic) => (
                              <option key={topic.id} value={topic.id}>
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
                                  onChange={(e) =>
                                    handleBitChange(index, 'description', e.target.value)
                                  }
                                />

                                {taskForm.repeats === 'never' ? (
                                  <input
                                    className="topic-input"
                                    type="date"
                                    value={bit.doDate}
                                    onChange={(e) =>
                                      handleBitChange(index, 'doDate', e.target.value)
                                    }
                                  />
                                ) : (
                                  <div className="repeat-static-text">
                                    No DO date for repeating tasks
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        <button className="done-button" onClick={handleSaveTask}>
                          save
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showSettingsPopup && (
          <div className="popup-overlay" onClick={() => setShowSettingsPopup(false)}>
            <div className="main popup-window" onClick={(e) => e.stopPropagation()}>
              <div className="popup-bar top">
                <h1 className="popup-title">
                  <u>SETTINGS</u>
                </h1>
              </div>

              <button className="popup-close" onClick={() => setShowSettingsPopup(false)}>
                ×
              </button>

              <div className="pop-content">
                <div className="empty-task-editor">
                  <h1 className="block-heading time-heading centered-heading">Settings</h1>
                  <p className="body-text empty-editor-text">Coming soon.</p>
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