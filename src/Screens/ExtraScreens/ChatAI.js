import {
  View,
  Text,
  ImageBackground,
  Image,
  KeyboardAvoidingView,
  StatusBar,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Dimensions,
  PermissionsAndroid,
  Alert,
  Modal,
  Button,
} from 'react-native';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Sound, {
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  RecordBackType,
  PlayBackType,
} from 'react-native-nitro-sound';
import { Colors, fonts, images, styles } from '../../Constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CalendarStrip from 'react-native-calendar-strip';
import moment from 'moment';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { AllGetAPI, PostAPiwithToken } from '../../Components/ApiRoot';
import { OPEN_AI_KEY } from '../../Components/OpenAi_Key';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TranslatableText from '../../Components/customText/TranslatableText';

const CREATION_KEYWORDS = {
  task: ['create task', 'add task', 'new task', 'make task'],
  reminder: ['create reminder', 'add reminder', 'set reminder', 'new reminder'],
  note: ['create note', 'add note', 'new note', 'write note', 'take a note'],
  plan: ['create plan', 'add plan', 'new plan', 'create planner'],
  meeting: ['create meeting', 'schedule meeting', 'add meeting', 'set meeting'],
  alarm: ['create alarm', 'set alarm', 'add alarm'],
  community: [
    'create community',
    'add community',
    'new community',
    'create group',
  ],
};
const MEMBER_PREVIEW_LIMIT = 6;
const ALARM_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MEETING_DURATIONS = [
  '1 hour',
  '2 hours',
  '3 hours',
  '4 hours',
  '5 hours',
  '6 hours',
  '7 hours',
  '8 hours',
];

const ChatAI = ({ navigation }) => {
  const user = useSelector(state => state.user.user);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [chatMembers, setChatMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showRecordingModal, setShowRecordingModal] = useState(false);
  const flatListRef = useRef(null);
  const apiKey = OPEN_AI_KEY;
  const conversationContext = useRef([]).current;
  const screenHeight = Dimensions.get('window').height;
  // console.log('apikey', apiKey);
  // Creation flow states
  const [creationContext, setCreationContext] = useState(null);
  const [creationStep, setCreationStep] = useState(0);
  const [collectedFields, setCollectedFields] = useState({});
  const [isRecording, setIsRecording] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [recordTime, setRecordTime] = useState('00:00:00');
  const [playTime, setPlayTime] = useState('00:00:00');
  const [duration, setDuration] = useState('00:00:00');
  const [audioPath, setAudioPath] = useState('');
  const [isSending, setIsSending] = useState(false);

  const CheckSubscription = () => {
    AllGetAPI({ url: 'check-subscription', Token: user?.api_token })
      .then(res => {
        // console.log('check subscription', JSON.stringify(res));
        if (res.subscription === 0) {
          navigation.navigate('Subscription');
        }
        // setMyNotes(res.data || [])
      })
      .catch(err => console.log('api error notes', err));
  };

  useFocusEffect(
    useCallback(() => {
      CheckSubscription();
    }, []),
  );

  const appendUserMessage = text => {
    const newUserMessage = { type: 'user', text };
    setMessages(prev => [...prev, newUserMessage]);
    conversationContext.push({ role: 'user', content: text });
  };
  const requestPermissions = async () => {
    if (Platform.OS !== 'android') return true;

    try {
      const permissions = [PermissionsAndroid.PERMISSIONS.RECORD_AUDIO];

      if (Platform.Version >= 33) {
        // permissions.push(PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO);
      } else {
        permissions.push(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
      }

      const grants = await PermissionsAndroid.requestMultiple(permissions);

      const denied = permissions.filter(
        permission => grants[permission] !== PermissionsAndroid.RESULTS.GRANTED,
      );

      if (denied.length > 0) {
        Alert.alert('Permissions denied', denied.join('\n'));
        return false;
      }

      return true;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  // Recording
  const onStartRecord = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;
    setIsLoading(true);
    try {
      const result = await Sound.startRecorder();
      Sound.addRecordBackListener(e => {
        setRecordTime(Sound.mmssss(Math.floor(e.currentPosition)));
      });
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onStopRecord = async () => {
    setIsLoading(true);
    try {
      const result = await Sound.stopRecorder();
      Sound.removeRecordBackListener();
      setIsRecording(false);
      setAudioPath(result);
      console.log(result);
    } catch (error) {
      console.error('Failed to stop recording:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onStartPlay = async () => {
    setIsLoading(true);
    try {
      const msg = await Sound.startPlayer(audioPath);
      Sound.addPlayBackListener(e => {
        setPlayTime(Sound.mmssss(Math.floor(e.currentPosition)));
        setDuration(Sound.mmssss(Math.floor(e.duration)));
      });

      // Use the proper playback end listener
      Sound.addPlaybackEndListener(e => {
        console.log('Playback completed', e);
        setIsPlaying(false);
        setPlayTime('00:00:00');
      });

      setIsPlaying(true);
    } catch (error) {
      console.error('Failed to start playback:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onStopPlay = async () => {
    setIsLoading(true);
    try {
      await Sound.stopPlayer();
      Sound.removePlayBackListener();
      Sound.removePlaybackEndListener();
      setIsPlaying(false);
      setPlayTime('00:00:00');
      setDuration('00:00:00');
    } catch (error) {
      console.error('Failed to stop playback:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const appendBotMessage = text => {
    const newBotMessage = { type: 'bot', text };
    setMessages(prev => [...prev, newBotMessage]);
    conversationContext.push({ role: 'assistant', content: text });
  };

  const resetCreationState = () => {
    setCreationContext(null);
    setCreationStep(0);
    setCollectedFields({});
  };

  const normalizePriority = raw => {
    if (!raw) {
      return null;
    }
    const value = raw.toString().toLowerCase();
    if (value.includes('high')) {
      return 'High Priority';
    }
    if (value.includes('medium') || value.includes('mid')) {
      return 'Medium Priority';
    }
    if (value.includes('low')) {
      return 'Low Priority';
    }
    return null;
  };

  const normalizeDateInput = value => {
    const formats = [
      'YYYY-MM-DD',
      'DD-MM-YYYY',
      'DD/MM/YYYY',
      'MMM D, YYYY',
      'MMMM D, YYYY',
    ];
    const parsed = moment(value, formats, true);
    if (!parsed.isValid()) {
      return null;
    }
    return parsed.format('YYYY-MM-DD');
  };

  const normalizeTimeInput = value => {
    const formats = ['hh:mm A', 'h:mm A', 'HH:mm'];
    const parsed = moment(value, formats, true);
    if (!parsed.isValid()) {
      return null;
    }
    return parsed.format('hh:mm A');
  };

  const normalizeDateTimeInput = value => {
    const formats = [
      'YYYY-MM-DD hh:mm A',
      'YYYY-MM-DD h:mm A',
      'YYYY-MM-DD HH:mm',
      'MMM D, YYYY hh:mm A',
      'MMMM D, YYYY hh:mm A',
    ];
    const parsed = moment(value, formats, true);
    if (!parsed.isValid()) {
      return null;
    }
    return parsed.format('YYYY-MM-DD hh:mm A');
  };

  const parseMemberAnswer = (answer, options = {}) => {
    const { allowEmpty = false, requireKnownMember = false } = options;
    const trimmed = answer.trim();
    if (!trimmed) {
      return allowEmpty
        ? { success: true, value: { ids: [], label: 'Only you' } }
        : {
            success: false,
            error: 'Please provide at least one member name or say "only me".',
          };
    }
    const lower = trimmed.toLowerCase();
    if (
      lower === 'me' ||
      lower === 'only me' ||
      lower.includes('just me') ||
      lower.includes('myself')
    ) {
      return { success: true, value: { ids: [], label: 'Only you' } };
    }

    if (!chatMembers.length) {
      if (requireKnownMember) {
        return {
          success: false,
          error:
            'I couldn\'t find any saved members. Please add friends first or say "only me".',
        };
      }
      return { success: true, value: { ids: [], label: trimmed } };
    }

    const tokens = trimmed
      .split(',')
      .map(token => token.trim())
      .filter(Boolean);

    const matchedIds = [];
    const matchedNames = [];

    tokens.forEach(token => {
      const match = chatMembers.find(member =>
        member.name?.toLowerCase().includes(token.toLowerCase()),
      );
      if (match && !matchedIds.includes(match.id)) {
        matchedIds.push(match.id);
        matchedNames.push(match.name);
      }
    });

    if (!matchedIds.length) {
      const namesList = chatMembers
        .map(m => m.name)
        .filter(Boolean)
        .slice(0, MEMBER_PREVIEW_LIMIT)
        .join(', ');
      return {
        success: allowEmpty && !requireKnownMember,
        value: { ids: [], label: trimmed },
        error:
          allowEmpty && !requireKnownMember
            ? null
            : namesList
            ? `I couldn't match those names. Try using one of these: ${namesList}${
                chatMembers.length > MEMBER_PREVIEW_LIMIT ? ', ...' : ''
              }.`
            : 'I couldn\'t match those names. You can say "only me" if it\'s just you.',
      };
    }

    return {
      success: true,
      value: { ids: matchedIds, label: matchedNames.join(', ') },
    };
  };

  const buildMemberPrompt = (entityLabel, allowOnlyMe = true) => {
    const names = chatMembers.map(m => m.name).filter(Boolean);
    if (!names.length) {
      return allowOnlyMe
        ? `Who should be added to this ${entityLabel}? You don't have saved members yet, so say "only me" if it's just for you.`
        : `Who should be added to this ${entityLabel}? I couldn't find any saved members. Please add friends first or mention their names exactly as they appear in the app.`;
    }
    const preview = names.slice(0, MEMBER_PREVIEW_LIMIT).join(', ');
    const suffix = names.length > MEMBER_PREVIEW_LIMIT ? ', ...' : '';
    return `Who should be added to this ${entityLabel}? You can pick from: ${preview}${suffix}. Separate multiple names with commas.`;
  };

  const parseRepeatDays = answer => {
    const trimmed = answer.trim();
    if (!trimmed) {
      return {
        success: false,
        error: 'Please list at least one day (e.g., Mon, Wed, Fri).',
      };
    }
    const tokens = trimmed
      .split(',')
      .map(token => token.trim().toLowerCase())
      .filter(Boolean);
    if (!tokens.length) {
      return {
        success: false,
        error: 'Please list at least one day (e.g., Mon, Wed, Fri).',
      };
    }
    const normalized = [];
    tokens.forEach(token => {
      const candidate = ALARM_DAYS.find(day => {
        const lowerDay = day.toLowerCase();
        return lowerDay === token || lowerDay === token.slice(0, 3);
      });
      if (candidate && !normalized.includes(candidate)) {
        normalized.push(candidate);
      }
    });
    if (!normalized.length) {
      return {
        success: false,
        error:
          'I could not understand those days. Please use names like Mon, Tue, Wed.',
      };
    }
    return { success: true, value: normalized };
  };

  const detectCreationType = lowerMessage => {
    for (const [type, keywords] of Object.entries(CREATION_KEYWORDS)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        return type;
      }
    }
    return null;
  };

  const buildCreationConfig = type => {
    switch (type) {
      case 'task': {
        return {
          type,
          intro:
            "Sure, I can create a task for you. I'll ask for the details one by one.",
          fields: [
            {
              key: 'title',
              label: 'title',
              prompt: 'First, what is the task title?',
            },
            {
              key: 'description',
              label: 'description',
              prompt: 'Great. Please give me a short description of the task.',
            },
            {
              key: 'members',
              label: 'members',
              prompt: buildMemberPrompt('task', true),
              transform: value =>
                parseMemberAnswer(value, { allowEmpty: true }),
            },
            {
              key: 'start_datetime',
              label: 'start date & time',
              prompt:
                'When should the task start? Please use YYYY-MM-DD hh:mm AM/PM (example: 2025-12-01 03:30 PM).',
              transform: value => {
                const normalized = normalizeDateTimeInput(value);
                return normalized
                  ? { success: true, value: normalized }
                  : {
                      success: false,
                      error:
                        'Please provide the start date & time in YYYY-MM-DD hh:mm AM/PM format.',
                    };
              },
            },
            {
              key: 'end_datetime',
              label: 'end date & time',
              prompt:
                'When should the task end? Use the same format: YYYY-MM-DD hh:mm AM/PM.',
              transform: value => {
                const normalized = normalizeDateTimeInput(value);
                return normalized
                  ? { success: true, value: normalized }
                  : {
                      success: false,
                      error:
                        'Please provide the end date & time in YYYY-MM-DD hh:mm AM/PM format.',
                    };
              },
            },
            {
              key: 'priority',
              label: 'priority',
              prompt:
                'What priority should I set? Choose Low Priority, Medium Priority, or High Priority.',
              transform: value => {
                const normalized = normalizePriority(value);
                return normalized
                  ? { success: true, value: normalized }
                  : {
                      success: false,
                      error:
                        'Please choose one of: Low Priority, Medium Priority, or High Priority.',
                    };
              },
            },
            {
              key: 'attachments',
              label: 'attachments',
              optional: true,
              prompt:
                'Do you want to add any attachments? I can make a note so you remember to upload them later from the task screen.',
            },
          ],
          summary: data => {
            const memberLabel =
              data.members?.label && data.members.label !== 'Only you'
                ? data.members.label
                : 'Only you';
            return (
              'Here is the task I am about to create:\n' +
              `• Title: ${data.title}\n` +
              `• Description: ${data.description}\n` +
              `• Members: ${memberLabel}\n` +
              `• Start: ${data.start_datetime}\n` +
              `• End: ${data.end_datetime}\n` +
              `• Priority: ${data.priority}\n` +
              (data.attachments
                ? `• Attachment note: ${data.attachments}\n`
                : '') +
              '\nCreating this task now...'
            );
          },
          submit: handleTaskSubmission,
        };
      }
      case 'reminder':
        return {
          type,
          intro: "Let's set up a reminder.",
          fields: [
            {
              key: 'title',
              label: 'title',
              prompt: 'What should this reminder be called?',
            },
            {
              key: 'date',
              label: 'date',
              prompt:
                'Which date should it trigger? Please use YYYY-MM-DD (example: 2025-12-01).',
              transform: value => {
                const normalized = normalizeDateInput(value);
                return normalized
                  ? { success: true, value: normalized }
                  : {
                      success: false,
                      error: 'Please provide the date in YYYY-MM-DD format.',
                    };
              },
            },
            {
              key: 'start_time',
              label: 'start time',
              prompt:
                'What is the start time? Use hh:mm AM/PM (example: 08:30 AM).',
              transform: value => {
                const normalized = normalizeTimeInput(value);
                return normalized
                  ? { success: true, value: normalized }
                  : {
                      success: false,
                      error:
                        'Please provide the start time in hh:mm AM/PM format.',
                    };
              },
            },
            {
              key: 'end_time',
              label: 'end time',
              prompt:
                'What is the end time? Use hh:mm AM/PM (example: 09:00 AM).',
              transform: value => {
                const normalized = normalizeTimeInput(value);
                return normalized
                  ? { success: true, value: normalized }
                  : {
                      success: false,
                      error:
                        'Please provide the end time in hh:mm AM/PM format.',
                    };
              },
            },
          ],
          summary: data =>
            'Here is the reminder I will create:\n' +
            `• Title: ${data.title}\n` +
            `• Date: ${data.date}\n` +
            `• Start: ${data.start_time}\n` +
            `• End: ${data.end_time}\n\nCreating this reminder now...`,
          submit: handleReminderSubmission,
        };
      case 'note':
        return {
          type,
          intro: 'Sure, let me take a note for you.',
          fields: [
            {
              key: 'description',
              label: 'note',
              prompt: 'What should the note say?',
            },
          ],
          summary: data =>
            'Saving this note:\n' +
            `• Note: ${data.description}\n\nSaving it now...`,
          submit: handleNoteSubmission,
        };
      case 'plan':
        return {
          type,
          intro: "Let's create a plan.",
          fields: [
            {
              key: 'title',
              label: 'title',
              prompt: 'What is the plan title?',
            },
            {
              key: 'members',
              label: 'members',
              prompt: buildMemberPrompt('plan', false),
              transform: value =>
                parseMemberAnswer(value, { requireKnownMember: true }),
            },
            {
              key: 'date',
              label: 'date',
              prompt: 'On which date? Use YYYY-MM-DD.',
              transform: value => {
                const normalized = normalizeDateInput(value);
                return normalized
                  ? { success: true, value: normalized }
                  : {
                      success: false,
                      error: 'Please provide the date in YYYY-MM-DD format.',
                    };
              },
            },
            {
              key: 'start_time',
              label: 'start time',
              prompt: 'What is the start time? Use hh:mm AM/PM.',
              transform: value => {
                const normalized = normalizeTimeInput(value);
                return normalized
                  ? { success: true, value: normalized }
                  : {
                      success: false,
                      error:
                        'Please provide the start time in hh:mm AM/PM format.',
                    };
              },
            },
            {
              key: 'end_time',
              label: 'end time',
              prompt: 'What is the end time? Use hh:mm AM/PM.',
              transform: value => {
                const normalized = normalizeTimeInput(value);
                return normalized
                  ? { success: true, value: normalized }
                  : {
                      success: false,
                      error:
                        'Please provide the end time in hh:mm AM/PM format.',
                    };
              },
            },
            {
              key: 'description',
              label: 'description',
              prompt: 'Finally, give me a short description for the plan.',
            },
          ],
          summary: data =>
            'Here is the plan I will create:\n' +
            `• Title: ${data.title}\n` +
            `• Members: ${data.members?.label || 'Not specified'}\n` +
            `• Date: ${data.date}\n` +
            `• Start: ${data.start_time}\n` +
            `• End: ${data.end_time}\n` +
            `• Description: ${data.description}\n\nCreating this plan now...`,
          submit: handlePlanSubmission,
        };
      case 'meeting':
        return {
          type,
          intro: "Let's schedule a meeting.",
          fields: [
            {
              key: 'title',
              label: 'title',
              prompt: 'What is the meeting title?',
            },
            {
              key: 'members',
              label: 'members',
              prompt: buildMemberPrompt('meeting', false),
              transform: value =>
                parseMemberAnswer(value, { requireKnownMember: true }),
            },
            {
              key: 'duration',
              label: 'duration',
              prompt:
                'How long should it last? Choose between 1 hour and 8 hours (example: "2 hours").',
              transform: value => {
                if (!value.trim()) {
                  return {
                    success: false,
                    error:
                      'Please provide a duration such as "1 hour" or "2 hours".',
                  };
                }
                const normalized = value
                  .toLowerCase()
                  .replace('hrs', 'hours')
                  .replace('hr', 'hour')
                  .trim();
                const match = MEETING_DURATIONS.find(
                  option => option === normalized,
                );
                return match
                  ? { success: true, value: match }
                  : {
                      success: false,
                      error:
                        'Please choose a whole number of hours between 1 and 8.',
                    };
              },
            },
            {
              key: 'date',
              label: 'date',
              prompt: 'On which date? Use YYYY-MM-DD.',
              transform: value => {
                const normalized = normalizeDateInput(value);
                return normalized
                  ? { success: true, value: normalized }
                  : {
                      success: false,
                      error: 'Please provide the date in YYYY-MM-DD format.',
                    };
              },
            },
            {
              key: 'start_time',
              label: 'start time',
              prompt: 'What is the start time? Use hh:mm AM/PM.',
              transform: value => {
                const normalized = normalizeTimeInput(value);
                return normalized
                  ? { success: true, value: normalized }
                  : {
                      success: false,
                      error:
                        'Please provide the start time in hh:mm AM/PM format.',
                    };
              },
            },
            {
              key: 'end_time',
              label: 'end time',
              prompt: 'What is the end time? Use hh:mm AM/PM.',
              transform: value => {
                const normalized = normalizeTimeInput(value);
                return normalized
                  ? { success: true, value: normalized }
                  : {
                      success: false,
                      error:
                        'Please provide the end time in hh:mm AM/PM format.',
                    };
              },
            },
            {
              key: 'description',
              label: 'description',
              prompt: 'Lastly, add a brief description for the meeting.',
            },
          ],
          summary: data =>
            'Here is the meeting I will schedule:\n' +
            `• Title: ${data.title}\n` +
            `• Members: ${data.members?.label || 'Not specified'}\n` +
            `• Duration: ${data.duration}\n` +
            `• Date: ${data.date}\n` +
            `• Start: ${data.start_time}\n` +
            `• End: ${data.end_time}\n` +
            `• Description: ${data.description}\n\nScheduling it now...`,
          submit: handleMeetingSubmission,
        };
      case 'alarm':
        return {
          type,
          intro: "Sure, let's set an alarm.",
          fields: [
            {
              key: 'title',
              label: 'alarm name',
              prompt: 'What should I call this alarm?',
            },
            {
              key: 'time',
              label: 'time',
              prompt: 'What time should it ring? Use hh:mm AM/PM.',
              transform: value => {
                const normalized = normalizeTimeInput(value);
                return normalized
                  ? { success: true, value: normalized }
                  : {
                      success: false,
                      error: 'Please provide the time in hh:mm AM/PM format.',
                    };
              },
            },
            {
              key: 'repeat',
              label: 'repeat days',
              prompt:
                'On which days should it repeat? List days like Mon, Tue, Wed (comma separated).',
              transform: parseRepeatDays,
            },
          ],
          summary: data =>
            'Here is the alarm I will set:\n' +
            `• Name: ${data.title}\n` +
            `• Time: ${data.time}\n` +
            `• Repeat: ${data.repeat.join(', ')}\n\nSetting it now...`,
          submit: handleAlarmSubmission,
        };
      case 'community':
        return {
          type,
          intro: "Let's create a community.",
          fields: [
            {
              key: 'title',
              label: 'title',
              prompt: 'What is the community name?',
            },
            {
              key: 'members',
              label: 'members',
              prompt: buildMemberPrompt('community', true),
              transform: value =>
                parseMemberAnswer(value, { allowEmpty: true }),
            },
            {
              key: 'description',
              label: 'description',
              prompt: 'Give me a short description for this community.',
            },
            {
              key: 'attachments',
              label: 'attachments',
              optional: true,
              prompt:
                'Do you want to mention any attachments or cover images? I can note it so you remember to add them later.',
            },
          ],
          summary: data =>
            'Here is the community I will create:\n' +
            `• Title: ${data.title}\n` +
            `• Members: ${data.members?.label || 'Only you'}\n` +
            `• Description: ${data.description}\n` +
            (data.attachments
              ? `• Attachment note: ${data.attachments}\n`
              : '') +
            '\nCreating this community now...',
          submit: handleCommunitySubmission,
        };
      default:
        return null;
    }
  };

  const startCreationFlow = type => {
    const config = buildCreationConfig(type);
    if (!config || !config.fields || config.fields.length === 0) {
      appendBotMessage("I don't know how to create that yet, sorry.");
      return;
    }
    setCreationContext(config);
    setCreationStep(0);
    setCollectedFields({});
    const firstPrompt =
      (config.intro ? `${config.intro}\n\n` : '') + config.fields[0].prompt;
    appendBotMessage(firstPrompt);
  };

  const runCreationApiCall = async ({
    url,
    formdata,
    successText,
    onSuccess,
  }) => {
    try {
      setIsLoading(true);
      const res = await PostAPiwithToken(
        { url, Token: user?.api_token },
        formdata,
      );
      if (res?.status === 'success') {
        appendBotMessage(successText || res?.message || 'All set!');
        if (typeof onSuccess === 'function') {
          onSuccess(res);
        }
      } else {
        appendBotMessage(
          res?.message ||
            'I tried to create it, but the server responded with an error.',
        );
      }
    } catch (error) {
      console.log('Creation API error:', error);
      appendBotMessage(
        'Sorry, I could not reach the server right now. Please try again later.',
      );
    } finally {
      setIsLoading(false);
      resetCreationState();
    }
  };

  const handleTaskSubmission = async data => {
    const formdata = new FormData();
    formdata.append('title', data.title);
    formdata.append('description', data.description);
    formdata.append('start_datetime', data.start_datetime);
    formdata.append('end_datetime', data.end_datetime);
    if (data.members?.ids?.length) {
      data.members.ids.forEach(id => formdata.append('members[]', id));
    }
    if (data.priority) {
      formdata.append('priority', data.priority);
    }
    await runCreationApiCall({
      url: 'add-task',
      formdata,
      successText: 'Your task has been created successfully in Dayahead ✅',
      onSuccess: () => getAllTasks(),
    });
  };

  const handleReminderSubmission = async data => {
    const formdata = new FormData();
    formdata.append('title', data.title);
    formdata.append('date', data.date);
    formdata.append('start_time', data.start_time);
    formdata.append('end_time', data.end_time);
    await runCreationApiCall({
      url: 'add-reminder',
      formdata,
      successText: 'Reminder added successfully ✅',
    });
  };

  const handleNoteSubmission = async data => {
    const formdata = new FormData();
    formdata.append('description', data.description);
    await runCreationApiCall({
      url: 'add-note',
      formdata,
      successText: 'Your note is saved ✅',
    });
  };

  const handlePlanSubmission = async data => {
    const formdata = new FormData();
    formdata.append('title', data.title);
    data.members?.ids?.forEach(id => formdata.append('member_ids[]', id));
    formdata.append('date', data.date);
    formdata.append('start_time', data.start_time);
    formdata.append('end_time', data.end_time);
    formdata.append('description', data.description);
    await runCreationApiCall({
      url: 'add-planner',
      formdata,
      successText: 'Your plan has been created successfully ✅',
    });
  };

  const handleMeetingSubmission = async data => {
    const formdata = new FormData();
    formdata.append('title', data.title);
    data.members?.ids?.forEach(id => formdata.append('member_ids[]', id));
    formdata.append('duration', data.duration);
    formdata.append('date', data.date);
    formdata.append('start_time', data.start_time);
    formdata.append('end_time', data.end_time);
    formdata.append('description', data.description);
    await runCreationApiCall({
      url: 'create-meeting',
      formdata,
      successText: 'Meeting scheduled successfully ✅',
    });
  };

  const handleAlarmSubmission = async data => {
    const formdata = new FormData();
    formdata.append('title', data.title);
    data.repeat.forEach(day => formdata.append('repeat[]', day));
    formdata.append('time', data.time);
    await runCreationApiCall({
      url: 'add-alaram',
      formdata,
      successText: 'Alarm created successfully ✅',
    });
  };

  const handleCommunitySubmission = async data => {
    const formdata = new FormData();
    formdata.append('title', data.title);
    if (data.members?.ids?.length) {
      data.members.ids.forEach(id => formdata.append('members[]', id));
    }
    formdata.append('description', data.description);
    await runCreationApiCall({
      url: 'add-community',
      formdata,
      successText: 'Community created successfully ✅',
    });
  };

  const processCreationResponse = async userAnswer => {
    if (!creationContext) {
      return;
    }

    const field = creationContext.fields[creationStep];
    const trimmed = userAnswer.trim();

    if (!trimmed && !field?.optional) {
      appendBotMessage(
        `Please provide the ${
          field?.label || 'required detail'
        } so I can continue.`,
      );
      return;
    }

    let finalValue = trimmed;
    if (field?.transform) {
      const result = field.transform(trimmed);
      if (!result || result.success === false) {
        appendBotMessage(
          result?.error ||
            `I couldn't understand that ${field.label}. Please try again.`,
        );
        return;
      }
      finalValue = result.value;
    }

    const updatedFields = {
      ...collectedFields,
      [field.key]: finalValue,
    };
    setCollectedFields(updatedFields);

    const nextStep = creationStep + 1;

    if (nextStep < creationContext.fields.length) {
      setCreationStep(nextStep);
      const nextField = creationContext.fields[nextStep];
      appendBotMessage(nextField.prompt);
      return;
    }

    const summaryText = creationContext.summary
      ? creationContext.summary(updatedFields)
      : 'Great, creating it now...';
    appendBotMessage(summaryText);

    await creationContext.submit(updatedFields);
  };

  // Fetch tasks & members on component mount
  useEffect(() => {
    getAllTasks();
    getAllMembers();
    // Add welcome message
    setMessages([
      {
        type: 'bot',
        text: 'Hi! I\'m Dayahead AI, your personal assistant for the Dayahead app. I can help you with:\n\n• Your tasks, reminders, and schedule\n• Questions about how to use Dayahead features\n• Tips and guidance for better productivity\n\nTry asking me: "What are my tasks today?" or "How do I create a task?" or "What features does Dayahead have?"',
      },
    ]);
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const getAllTasks = () => {
    AllGetAPI({ url: 'view-all-task', Token: user?.api_token })
      .then(res => {
        setMyTasks(res.data || []);
        console.log('Tasks loaded:', res.data?.length || 0);
      })
      .catch(err => console.log('API error loading tasks', err));
  };

  const getAllMembers = () => {
    AllGetAPI({ url: 'friends', Token: user?.api_token })
      .then(res => {
        setChatMembers(res.data || []);
      })
      .catch(err => console.log('API error loading members', err));
  };

  // Get today's tasks
  const getTodayTasks = () => {
    const today = moment();
    return myTasks.filter(task => {
      if (task.start_datetime) {
        const taskDate = moment(task.start_datetime, 'YYYY-MM-DD hh:mm A');
        return taskDate.isSame(today, 'day');
      }
      return false;
    });
  };

  // Format tasks for AI context
  const formatTasksForAI = tasks => {
    if (!tasks || tasks.length === 0) {
      return 'The user has no tasks.';
    }

    return tasks
      .map((task, index) => {
        const taskDate = task.start_datetime
          ? moment(task.start_datetime, 'YYYY-MM-DD hh:mm A').format(
              'MMM DD, YYYY hh:mm A',
            )
          : 'No date specified';
        return `${index + 1}. ${task.title || 'Untitled Task'} - ${
          task.description || 'No description'
        } (Date: ${taskDate}, Priority: ${
          task.priority || 'Not set'
        }, Status: ${task.status || 'Not set'})`;
      })
      .join('\n');
  };
  const sendAudioToAi = async () => {
    if (!audioPath || audioPath.trim() === '') {
      console.log('No audio file selected');
      return;
    }
    setIsSending(true);
    try {
      const formData = new FormData();

      formData.append('file', {
        uri: audioPath,
        type: 'audio/mp4', // mp4 container for your file
        name: 'recording.mp4',
      });

      formData.append('model', 'gpt-4o-transcribe');

      const response = await axios.post(
        'https://api.openai.com/v1/audio/transcriptions',
        formData,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`, // NEVER hardcode in production
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      sendMessage(response.data.text);
      setShowRecordingModal(false);
      setAudioPath('');
      setRecordTime('00:00:00');
      setPlayTime('00:00:00');
      setDuration('00:00:00');
      set;
      console.log('AI Transcript:', response.data.text);
    } catch (error) {
      console.log('Error:', error.response?.data || error.message);
    } finally {
      setIsSending(false);
    }
  };

  // Send message to OpenAI
  const sendMessage = async (messageToSend = null) => {
    const messageText = messageToSend || message;
    if (!messageText || !messageText.trim()) return;

    const userMessage = messageText.trim();
    if (!messageToSend) {
      setMessage('');
    }

    // Check if we're in a creation flow
    if (creationContext) {
      appendUserMessage(userMessage);
      await processCreationResponse(userMessage);
      return;
    }

    // Add user message to UI
    appendUserMessage(userMessage);

    const lowerMessage = userMessage.toLowerCase();
    const detectedCreation = detectCreationType(lowerMessage);
    if (detectedCreation) {
      startCreationFlow(detectedCreation);
      return;
    }

    setIsLoading(true);

    try {
      // Get today's tasks for context
      const todayTasks = getTodayTasks();
      const tasksContext = formatTasksForAI(todayTasks);
      const allTasksContext = formatTasksForAI(myTasks);

      // Build system prompt with task context and app knowledge
      const systemPrompt = `You are Dayahead AI, an intelligent and helpful assistant for the Dayahead productivity app. Your role is to help users with both their personal tasks/data and general questions about the Dayahead app.

ABOUT DAYAHEAD APP:
Dayahead is a comprehensive productivity and task management application that helps users organize their daily life. Key features include:

1. TASK MANAGEMENT:
   - Create, view, and manage tasks with priorities (High, Medium, Low)
   - Task statuses: Pending, In Progress, Completed
   - Tasks have dates, times, descriptions, and can be shared with team members

2. REMINDERS:
   - Set reminders with dates and times
   - Get notified about important events

3. NOTES:
   - Create and manage notes
   - Organize thoughts and information

4. PLANNING & SCHEDULING:
   - Daily planning features
   - Calendar integration
   - Schedule management

5. MEETINGS:
   - Create and manage meetings
   - Schedule with team members

6. COMMUNITIES:
   - Join and create communities
   - Collaborate with others
   - Share content

7. STATS & PRODUCTIVITY:
   - Track productivity scores
   - View statistics and progress
   - Monitor task completion

8. JOURNAL:
   - Keep a personal journal
   - Track daily activities

9. CHAT & COMMUNICATION:
   - Chat with team members
   - Video calls (via ZegoCloud integration)

10. ALARMS:
    - Set alarms for reminders
    - Wake up alarms

11. FRIENDS & MEMBERS:
    - Add friends and team members
    - Share tasks and plans

12. SPOTIFY INTEGRATION:
    - Listen to podcasts and audio content

USER'S CURRENT DATA:
The user's tasks for today are:
${tasksContext}

The user's all tasks are:
${allTasksContext}

Today's date is: ${moment().format('MMMM DD, YYYY')}

INSTRUCTIONS:
- When users ask about their tasks (e.g., "what is my task today"), provide specific information from their task data above
- When users ask general questions about the Dayahead app features, functionality, or how to use something, answer based on the app knowledge provided
- Be conversational, friendly, concise, and helpful
- If you don't know something specific about the user's data, say so politely
- Help users understand how to use app features effectively
- Provide step-by-step guidance when needed
- Be encouraging and supportive in your responses`;

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
            ...conversationContext.slice(-10), // Keep last 10 messages for context
            { role: 'user', content: userMessage },
          ],
          max_tokens: 800,
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const aiResponse = response.data.choices[0].message.content.trim();

      // Add AI response to UI
      const newBotMessage = { type: 'bot', text: aiResponse };
      setMessages(prev => [...prev, newBotMessage]);
      conversationContext.push({ role: 'assistant', content: aiResponse });
    } catch (error) {
      console.error('OpenAI API error:', error.response?.data || error.message);
      const errorMsg =
        error.response?.status === 429
          ? 'Rate limit reached. Please wait a moment and try again.'
          : "Sorry, I couldn't process your request right now. Please try again.";

      const errorMessage = { type: 'bot', text: errorMsg };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = ({ item, index }) => {
    const isUser = item.type === 'user';
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: isUser ? 'flex-end' : 'flex-start',
          marginBottom: wp(4),
          paddingHorizontal: wp(5),
          alignItems: 'flex-end',
        }}
      >
        {!isUser && (
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: 'Colors.lightgreen',
              marginRight: wp(2),
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 2,
              borderColor: Colors.mainColor,
            }}
          >
            <Image
              source={images.avatarpic}
              style={{ width: 28, height: 28, borderRadius: 14 }}
              resizeMode="cover"
            />
          </View>
        )}
        <View
          style={{
            maxWidth: wp(72),
            backgroundColor: isUser ? Colors.mainColor : '#0000008C',
            paddingHorizontal: wp(4),
            paddingVertical: wp(3.5),
            borderRadius: isUser ? wp(4) : wp(4),
            borderTopLeftRadius: isUser ? wp(4) : wp(1),
            borderTopRightRadius: isUser ? wp(1) : wp(4),
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <TranslatableText
            targetLang="fr"
            style={{
              fontSize: 15,
              fontFamily: fonts.medium,
              color: Colors.white,
              lineHeight: 22,
            }}
          >
            {item.text}
          </TranslatableText>
          {/* <Text
            style={{
              fontSize: 15,
              fontFamily: fonts.medium,
              color: Colors.white,
              lineHeight: 22,
            }}
          >
            {item.text}
          </Text> */}
        </View>
        {isUser && (
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: Colors.mainColor,
              marginLeft: wp(2),
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 2,
              // borderColor: Colors.white,
            }}
          >
            <Text
              style={{
                color: Colors.white,
                fontSize: 14,
                fontFamily: fonts.bold,
              }}
            >
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </Text>
          </View>
        )}
      </View>
    );
  };
  const { top } = useSafeAreaInsets();
  return (
    <View
      style={{
        flex: 1,
        paddingTop: Platform.OS === 'ios' ? 10 : 0,
        height: screenHeight,
      }}
    >
      <ImageBackground
        source={images.mainImage}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
        }}
        resizeMode="cover"
        pointerEvents="none"
      />

      <StatusBar
        translucent
        backgroundColor={'transparent'}
        barStyle={'light-content'}
      />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          // elevation: 4,
          width: wp(100),
          height: wp(25),
          // backgroundColor: '#FAFAFA',
          paddingHorizontal: wp(4),
          paddingTop: wp(5),
          // shadowColor: '#000',
          // shadowOffset: { width: 0, height: 6 }, // push shadow down
          // shadowOpacity: 0.2,
          // shadowRadius: 3,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: 'white',
            width: 30,
            height: 30,
            borderRadius: 30,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="left" size={20} color={Colors.black} />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* <Image
            source={images.avatarpic}
            resizeMode="contain"
            style={{ width: 34, height: 34, borderRadius: 18 }}
          /> */}
          <Text
            style={{
              fontSize: 16,
              fontFamily: fonts.bold,
              color: Colors.white,
              marginRight: wp(7),
            }}
          >
            Dayahead AI Chat
          </Text>
        </View>
        <Text></Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, zIndex: 1, position: 'relative' }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        enabled
      >
        <View style={{ flex: 1, marginTop: 30 }}>
          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{
              paddingTop: wp(3),
              paddingBottom: wp(25),
            }}
            ref={flatListRef}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() => {
              if (flatListRef.current) {
                setTimeout(() => {
                  flatListRef.current.scrollToEnd({ animated: true });
                }, 100);
              }
            }}
            onLayout={() => {
              if (flatListRef.current && messages.length > 0) {
                setTimeout(() => {
                  flatListRef.current.scrollToEnd({ animated: false });
                }, 100);
              }
            }}
          />

          {isLoading && (
            <View
              style={{
                paddingHorizontal: wp(5),
                paddingBottom: wp(2),
                marginTop: wp(2),
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: Colors.lightgreen,
                    marginRight: wp(2),
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 2,
                    borderColor: Colors.mainColor,
                  }}
                >
                  <Image
                    source={images.avatarpic}
                    style={{ width: 28, height: 28, borderRadius: 14 }}
                    resizeMode="cover"
                  />
                </View>
                <View
                  style={{
                    backgroundColor: Colors.white,
                    paddingHorizontal: wp(4),
                    paddingVertical: wp(3.5),
                    borderRadius: wp(4),
                    borderTopLeftRadius: wp(1),
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                    minWidth: wp(15),
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <ActivityIndicator size="small" color={Colors.mainColor} />
                </View>
              </View>
            </View>
          )}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => {
                setShowRecordingModal(true);
              }}
              disabled={isLoading}
              activeOpacity={0.7}
              style={{
                width: 40,
                height: wp(13),
                borderRadius: 12,
                backgroundColor: '#BD2BAF1A',

                justifyContent: 'center',
                alignItems: 'center',
                marginHorizontal: wp(2),
                opacity: isLoading ? 0.5 : 1,
                shadowColor: Colors.mainColor,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                // elevation: 3,
              }}
            >
              <Ionicons
                name={isRecording ? 'mic-off' : 'mic'}
                size={30}
                color={Colors.mainColor}
              />
            </TouchableOpacity>
            <Modal
              visible={showRecordingModal}
              transparent
              animationType="fade"
            >
              <View
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    width: '85%',
                    backgroundColor: '#1e1e1e',
                    padding: 20,
                    borderRadius: 12,
                    alignItems: 'center',
                  }}
                >
                  {/* Recording Timer */}
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 26,
                      fontWeight: 'bold',
                      marginBottom: 20,
                    }}
                  >
                    {recordTime}
                  </Text>

                  {/* Record Button */}
                  <View style={{ width: '100%', marginBottom: 20 }}>
                    {/* <Button
                      title={isRecording ? 'Stop Recording' : 'Start Recording'}
                      onPress={() => {
                        if (isRecording) {
                          onStopRecord();
                        } else {
                          setAudioPath('');
                          setRecordTime('00:00:00');
                          onStartRecord();
                        }
                      }}
                      disabled={isLoading}
                      color={isRecording ? '#ff4d4d' : '#4CAF50'}
                    /> */}
                    <TouchableOpacity
                      onPress={() => {
                        if (isRecording) {
                          onStopRecord();
                        } else {
                          setAudioPath('');
                          setRecordTime('00:00:00');
                          onStartRecord();
                        }
                      }}
                      style={{
                        backgroundColor: Colors.mainColor,
                        marginTop: 8,
                        borderRadius: 12,
                      }}
                      disabled={isLoading}
                    >
                      <Text
                        style={{
                          color: Colors.white,
                          fontSize: 16,
                          fontFamily: fonts.medium,
                          textAlign: 'center',
                          paddingVertical: 8,
                        }}
                      >
                        {isRecording ? 'Stop Recording' : 'Start Recording'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Loading Indicator */}
                  {isLoading && (
                    <ActivityIndicator
                      size="large"
                      color="#ffffff"
                      style={{ marginBottom: 15 }}
                    />
                  )}

                  {/* Playback Section */}
                  {audioPath !== '' && (
                    <View
                      style={{
                        width: '100%',
                        borderTopWidth: 1,
                        borderTopColor: '#333',
                        paddingTop: 15,
                        alignItems: 'center',
                      }}
                    >
                      <Text
                        style={{
                          color: '#ccc',
                          fontSize: 16,
                          marginBottom: 10,
                        }}
                      >
                        {playTime} / {duration}
                      </Text>

                      <View style={{ width: '100%' }}>
                        {/* <Button
                          title={isPlaying ? 'Stop Playback' : 'Play Recording'}
                          onPress={isPlaying ? onStopPlay : onStartPlay}
                          disabled={!audioPath || isLoading}
                          color={Colors.mainColor}
                        /> */}
                        <TouchableOpacity
                          onPress={isPlaying ? onStopPlay : onStartPlay}
                          style={{
                            backgroundColor: Colors.mainColor,
                            marginTop: 8,
                            borderRadius: 12,
                          }}
                          disabled={!audioPath || isLoading}
                        >
                          <Text
                            style={{
                              color: Colors.white,
                              fontSize: 16,
                              fontFamily: fonts.medium,
                              textAlign: 'center',
                              paddingVertical: 8,
                            }}
                          >
                            {isPlaying ? 'Stop Playback' : 'Play Recording'}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={sendAudioToAi}
                          style={{
                            backgroundColor: Colors.mainColor,
                            marginTop: 8,
                            borderRadius: 12,
                          }}
                        >
                          <Text
                            style={{
                              color: Colors.white,
                              fontSize: 16,
                              fontFamily: fonts.medium,
                              textAlign: 'center',
                              paddingVertical: 8,
                            }}
                          >
                            {isSending ? 'Sending...' : 'Submit to AI'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            </Modal>

            <View
              style={{
                width: '82%',
                minHeight: wp(13),
                borderRadius: wp(4),
                backgroundColor: '#BD2BAF1A',
                alignSelf: 'center',
                marginBottom: wp(4),
                marginTop: wp(2),
                flexDirection: 'row',
                alignItems: 'center',

                paddingHorizontal: wp(3),
                // paddingVertical: wp(2.5),
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
                // elevation: 5,
                borderWidth: 1.5,
                borderColor: Colors.mainColor,
              }}
            >
              <TextInput
                style={{
                  flex: 1,
                  paddingHorizontal: wp(3),
                  color: Colors.white,
                  fontFamily: fonts.regular,
                  fontSize: 15,
                  minHeight: 60,
                  maxHeight: wp(25),
                  // backgroundColor: 'red',
                  // paddingTop: wp(2),
                  // paddingBottom: wp(1),
                }}
                multiline
                placeholder="Ask Ai to suggest you a better task"
                placeholderTextColor={Colors.placeholder}
                value={message}
                onChangeText={text => setMessage(text)}
                onSubmitEditing={e => {
                  if (!e.nativeEvent.shiftKey && message.trim()) {
                    sendMessage();
                  }
                }}
                returnKeyType="send"
                blurOnSubmit={false}
              />
              <TouchableOpacity
                onPress={() => {
                  if (message.trim() && !isLoading) {
                    sendMessage();
                  }
                }}
                disabled={isLoading || !message.trim()}
                activeOpacity={0.7}
                style={{
                  width: wp(11),
                  height: wp(11),
                  borderRadius: wp(11) / 2,
                  // backgroundColor: Colors.mainColor,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: wp(2),
                  opacity: isLoading || !message.trim() ? 0.5 : 1,
                  shadowColor: Colors.mainColor,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  // elevation: 3,
                }}
              >
                <Ionicons name="send" size={20} color={Colors.mainColor} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ChatAI;
