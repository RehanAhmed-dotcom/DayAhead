import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  StatusBar,
  Image,
} from 'react-native';
import { Colors, fonts, images } from '../../Constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { AllGetAPI, PostAPiwithToken } from '../../Components/ApiRoot';
import { useSelector } from 'react-redux';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Fontisto from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';

const MeetingItem = ({ item }) => {
  const [openMenuId, setOpenMenuId] = useState(null);

  return (
    <View
      style={{
        flexDirection: 'columns',
        justifyContent: 'space-between',
        marginHorizontal: wp(4),
        marginVertical: wp(2),
        padding: 20,
        backgroundColor: '#BD2BAF50',
        borderRadius: 25,
      }}
    >
      {/* Time */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#FFFFFF30',
            paddingVertical: 8,
            paddingHorizontal: 18,
            borderRadius: 20,
          }}
        >
          <Text>
            <Fontisto name="access-time-filled" color="white" size={18} />
          </Text>
          <Text
            style={{
              color: 'white',
              fontFamily: fonts.medium,
              fontSize: 12,
              marginStart: 8,
            }}
          >
            {item.start_time} - {item.end_time}
          </Text>
        </View>
        <Pressable
          ref={ref => (buttonRefs.current[item.id] = ref)}
          onPress={() => {
            buttonRefs.current[item.id]?.measureInWindow(
              (x, y, width, height) => {
                setMenuPos({ x, y: y + height });
                setSelectedItem(item);
                setOpenMenuId(prev => (prev === item.id ? null : item.id));
              },
            );
          }}
          style={{ marginRight: -12 }}
        >
          <Fontisto name="more-vert" color="white" size={30} />
        </Pressable>
        {openMenuId === item.id && (
          <View
            style={{
              position: 'absolute',
              top: menuPos.y - 420,
              left: menuPos.x - 170, // adjust to align left of icon
              width: 140,
              padding: 8,
              backgroundColor: '#7A2A73',
              borderRadius: 6,
              elevation: 20,
              shadowColor: '#000',
              shadowOpacity: 0.25,
              shadowRadius: 4,
              zIndex: 999,
            }}
          >
            <Pressable
              onPress={() => {
                console.log('Join meeting', selectedItem?.id);
                // setOpenMenuId(0);
                // handleOptionSelect('Join Meeting');
              }}
              style={{ paddingVertical: 8 }}
            >
              <Text style={{ color: 'white' }}>Join Meeting</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                console.log('Cancel meeting', selectedItem?.id);
                // setOpenMenuId(1);
                // handleOptionSelect('Cancel Meeting');
              }}
              style={{ paddingVertical: 8 }}
            >
              <Text style={{ color: 'white' }}>Cancel Meeting</Text>
            </Pressable>
          </View>
        )}
      </View>

      <View style={{ marginTop: 5 }}>
        {/* Description */}
        <Text
          style={{
            color: 'white',
            fontFamily: fonts.bold,
            fontSize: 15,
            width: 270,
          }}
          numberOfLines={1}
        >
          {item.title}
        </Text>

        <Text
          style={{
            color: 'white',
            fontFamily: fonts.medium,
            fontSize: 14,
            marginTop: 8,
          }}
        >
          Meeting ID:{' '}
          <Text style={{ fontFamily: fonts.bold }}>{item.meeting_id}</Text>
        </Text>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 5,
          }}
        >
          {item.members.map((member, index) => (
            <Image
              key={index}
              source={{ uri: member.user?.image }}
              style={{
                width: 20,
                height: 20,
                borderRadius: 20,
                marginLeft: index === 0 ? 0 : -10, // overlapping effect
                borderWidth: 2,
                borderColor: 'white',
              }}
              resizeMode="cover"
            />
          ))}
          <Text
            style={{
              color: 'white',
              fontSize: 12,
              marginStart: 8,
              fontFamily: fonts.medium,
            }}
          >
            <Text>
              {item.members.length}{' '}
              {item.members.length === 1 ? 'Participant' : 'Participants'}
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

const TaskItem = ({ item, navigation, onDelete }) => {
  const formatTimeRange = (start, end) => {
    const getTime = dateTime =>
      dateTime.split(' ')[1] + ' ' + dateTime.split(' ')[2];
    return `${getTime(start)} - ${getTime(end)}`;
  };
  const getbackgroundColor = tag => {
    if (tag === 'Learning & Growth') {
      return '#004FD1';
    } else if (tag === 'Urgent Tasks') {
      return '#DC1318';
    } else if (tag === 'Creativity & Inspiration') {
      // return '#FFD300';
      return '#D6AC00';
    } else if (tag === 'Productivity Task') {
      return '#00C400';
    } else if (tag === 'Self-Improvement') {
      return '#AE1FFF';
    } else if (tag === 'LeaSocial & Relationships') {
      return '#CE8500';
    }
  };
  const formatCreatedTime = time => {
    const d = new Date(time);
    return d.toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const renderRightActions = id => {
    return (
      <TouchableOpacity
        style={[
          {
            backgroundColor: '#BD2BAF',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginr: 12,
            // marginVertical: wp(2),
            padding: 8,
            marginVertical: 16,
            borderRadius: wp(2),
          },
        ]}
        onPress={() => onDelete(id)}
      >
        <Fontisto name="delete" color="white" size={35} />
      </TouchableOpacity>
    );
  };

  return (
    <ReanimatedSwipeable
      renderRightActions={() => renderRightActions(item.id)}

      // onSwipeableOpen={() => console.log(item.id)}
    >
      <View>
        <TouchableOpacity
          // activeOpacity={0.85}
          onPress={() => {
            navigation.navigate('TaskDetails', {
              data: item,
            });
          }} // ← only non-completed tasks are clickable
          style={[
            // styles.flatView,
            {
              // backgroundColor: item.color || '#ECF7F3',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginHorizontal: wp(4),
              marginVertical: wp(2),
              padding: 8,
            },
          ]}
        >
          <View>
            <Text
              style={{
                fontSize: 18,
                fontFamily: fonts.bold,
                color: Colors.white,
                marginRight: wp(5),
                flexShrink: 1,
              }}
            >
              {formatCreatedTime(item.created_at)}
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              // backgroundColor: item.color || '#ECF7F3',
              backgroundColor: getbackgroundColor(item.tag),
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: wp(2),
            }}
          >
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: Colors.white,
                  fontFamily: fonts.bold,
                }}
              >
                {item?.title}
              </Text>
              <View
                style={{
                  paddingVertical: wp(1),
                  paddingHorizontal: wp(2),
                  borderRadius: wp(1),
                  backgroundColor:
                    item?.priority === 'High Priority'
                      ? '#F95555'
                      : item?.priority === 'Medium Priority'
                      ? '#3498DB'
                      : Colors.mainColor,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Image
                  source={images.flag}
                  resizeMode="contain"
                  style={{ width: wp(4), height: wp(4), marginRight: wp(1) }}
                />

                <Text
                  style={{
                    fontSize: 8,
                    fontFamily: fonts.bold,
                    color: Colors.white,
                  }}
                >
                  {item?.priority === 'High Priority'
                    ? 'High'
                    : item?.priority === 'Medium Priority'
                    ? 'Medium'
                    : 'Low'}
                </Text>
              </View>
            </View>
            <View
              style={{
                marginTop: wp(1),
                flexDirection: 'row',
                alignItems: 'center',
                alignContent: 'center',
              }}
            >
              <Text>
                <Fontisto name="access-time" color="white" size={12} />{' '}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: fonts.medium,
                  color: Colors.white,
                  marginRight: wp(2),
                  flexShrink: 1,
                }}
                numberOfLines={2}
              >
                {formatTimeRange(item.start_datetime, item.end_datetime)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </ReanimatedSwipeable>
  );
};

const SearchScreen = ({ navigation }) => {
  const user = useSelector(state => state.user.user);
  const [searchQuery, setSearchQuery] = useState('');
  const [myTasks, setMyTasks] = useState([]);
  const [allMeetings, setAllMeeting] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // ← ADDED

  const deleteTask = id => {
    const formdata = new FormData();
    formdata.append('id', id);
    PostAPiwithToken({ url: 'delete-task', Token: user?.api_token }, formdata)
      .then(res => {
        setIsLoading(false);
        console.log('apiresponse', JSON.stringify(res));
        if (res.status === 'success') {
          console.log(res);
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: res.message,
          });
          getAllTasks();
        } else {
          console.log(res);
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: res.message || 'Something went wrong',
          });
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log('Task delete error:', err);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to delete task',
        });
      });
  };

  // Use useMemo for filtered results
  const filteredItems = useMemo(() => {
    if (searchQuery.length === 0) {
      return [];
    }
    if (!searchQuery.trim()) {
      const meetingsWithType = allMeetings.map(item => ({
        ...item,
        type: 'meeting',
      }));
      const tasksWithType = myTasks.map(item => ({ ...item, type: 'task' }));
      return [...meetingsWithType, ...tasksWithType];
    }

    const lowerQuery = searchQuery.toLowerCase();

    const meetingsWithType = allMeetings
      .filter(item => item.title.toLowerCase().includes(lowerQuery))
      .map(item => ({ ...item, type: 'meeting' }));

    const tasksWithType = myTasks
      .filter(item => item.title.toLowerCase().includes(lowerQuery))
      .map(item => ({ ...item, type: 'task' }));

    return [...meetingsWithType, ...tasksWithType];
  }, [searchQuery, allMeetings, myTasks]);

  const getAllTasks = () => {
    AllGetAPI({ url: 'view-all-task', Token: user?.api_token })
      .then(res => {
        console.log('My All Tasks: ', res);
        setMyTasks(res?.data?.reverse() || []);
      })
      .catch(err => console.log('api error tasks', err));
  };

  const getAllMeetings = () => {
    AllGetAPI({ url: 'view-all-meeting', Token: user?.api_token })
      .then(res => {
        console.log('Meeting response:', res);
        if (res.status === 'success') {
          setAllMeeting(res.data || []);
        }
      })
      .catch(err => {
        console.log('meeting API error:', err);
      });
  };

  const handleSearch = query => {
    setSearchQuery(query);
  };

  useEffect(() => {
    getAllMeetings();
    getAllTasks();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'light-content'} />
      <ImageBackground
        source={images.mainImage}
        style={{
          flex: 1,
          paddingTop: Platform.OS === 'ios' ? 35 : 55,
          paddingHorizontal: 12,
        }}
        resizeMode="cover"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? hp(10) : 0}
        >
          {/* Search Input */}
          <View
            style={{
              marginTop: wp(4),
              marginBottom: wp(6),
              backgroundColor: 'rgba(0,0,0,0.4)',
              height: wp(13),
              borderRadius: 15,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <TextInput
              placeholder="Search here..."
              placeholderTextColor="#9E9E9E"
              value={searchQuery}
              onChangeText={handleSearch}
              style={{
                width: '100%',
                height: '100%',
                fontSize: 16,
                fontFamily: fonts.regular,
                color: Colors.white,
                paddingHorizontal: wp(4),
              }}
            />
          </View>

          {/* Results */}

          <FlatList
            data={filteredItems}
            keyExtractor={item => item.id.toString()}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                {searchQuery ? 'No matching items found' : 'No items available'}
              </Text>
            }
            renderItem={({ item }) =>
              item.type === 'meeting' ? (
                <MeetingItem item={item} />
              ) : (
                <TaskItem
                  item={item}
                  onDelete={deleteTask}
                  navigation={navigation}
                />
              )
            }
          />
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    // padding: 16,
  },
  searchInput: {
    width: '100%',
    fontSize: 16,
    fontFamily: fonts.regular,
    color: Colors.white,
    textAlign: 'center',
    paddingHorizontal: wp(4),
  },
  item: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemText: {
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    color: '#999',
  },
});
