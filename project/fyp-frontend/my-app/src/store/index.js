import { configureStore, createSlice } from "@reduxjs/toolkit";

const messageInitialState = {
  senderId:'',
  messages: [],
  isSender: null,
  saveMessage: "",
  error: "",
  oldMessages:[],
  allMessages:[],
  allData:[],
  loggedUserInfo:{},
  otherChatsInfo:[],
  count:0,
  totalcount:0,
};

const messageSlice = createSlice({
  name: "chat", // Corrected slice name to 'chat'
  initialState: messageInitialState,
  reducers: {
    setAllMessages(state, action) {
      state.allMessages = action.payload;
    },
    setLoggedUserinfo(state, action) {
      state.loggedUserInfo = action.payload;
      
    },
    setOtherChatsinfo(state, action) {
      state.otherChatsInfo = action.payload;
      
    },
    
    setAllData(state, action) {
      state.allData = action.payload;
    },
    setSenderId(state, action) {
      state.senderId = action.payload;
    },
    addMessage(state, action) {
      state.messages = [...state.messages, action.payload];
    },
    senderConnection(state, action) {
      state.isSender = action.payload;
    },
    saveinitialMessage(state, action) {
      state.saveMessage= action.payload;
    },
    chatError(state, action) {
      state.error = action.payload;
    },
    setMessages(state, action) {
      const newData = action.payload;

      // Check if newData is an array or object
      if (Array.isArray(newData)) {
        // If it's an array, replace the oldMessages array with the new array
        state.oldMessages = newData;
      } else if (typeof newData === 'object') {
        // If it's an object, merge it into the existing oldMessages array
        state.oldMessages = [...state.oldMessages, newData];
      } else {
        // Handle other sce
    }
  },
    setMessageCount(state, action) {
      state.count = action.payload;
    },
    setTotalMessageCount(state, action) {
      state.totalcount = action.payload;
    },
  },
});


const filterWorkerSlice = createSlice({
  name: "filterWorker",
  initialState: {
    minhourlyRate: null,
    maxhourlyRate: null,
    category: null,
    minExperience: null,
    maxExperience: null,
    results: [],
    selectedOption: "",
    imagePath: "",
    showInviteModal: false,
    InviteModalMessage: "",
    inviteWorker: "",
    InviteModalConfirmation: false,
    InviteModalConfirmationIndex: 0,
    confirmationIndexJob: {},
    jobs: [],
    inviteWorkersuccessmodel: false,
    openSnackbarError: false,
    inviteWorkererror: "",
    inviteWorkerResult: "",
  },
  reducers: {
    setMinHourlyRate: (state, action) => {
      state.minhourlyRate = action.payload;
    },
    setMaxHourlyRate: (state, action) => {
      state.maxhourlyRate = action.payload;
    },
    setCategory: (state, action) => {
      state.category = action.payload;
    },
    setMinExperience: (state, action) => {
      state.minExperience = action.payload;
    },
    setMaxExperience: (state, action) => {
      state.maxExperience = action.payload;
    },
    setResult: (state, action) => {
      state.results = [...state.results, ...action.payload];
    },
    setSelectedOption: (state, action) => {
      state.selectedOption = action.payload;
    },
    setImagePath: (state, action) => {
      state.imagePath = action.payload;
    },
    setInviteModal: (state, action) => {
      state.showInviteModal = action.payload;
    },
    setInviteModalMessage: (state, action) => {
      state.InviteModalMessage = action.payload;
    },
    setInviteWorker: (state, action) => {
      state.inviteWorker = action.payload;
    },
    setInviteModalConfirmation: (state, action) => {
      state.InviteModalConfirmation = action.payload;
    },
    setInviteModalConfirmationIndex: (state, action) => {
      state.InviteModalConfirmationIndex = action.payload;
    },
    setInviteModalConfirmationJob: (state, action) => {
      state.confirmationIndexJob = action.payload;
    },
    setViewPostedJobs: (state, action) => {
      state.jobs = action.payload;
    },
    inviteJobSuccessModel: (state, action) => {
      state.inviteWorkersuccessmodel = action.payload;
    },
    openSnackbarError: (state, action) => {
      state.openSnackbarError = action.payload;
    },
    errorInviteResult: (state, action) => {
      state.inviteWorkererror = action.payload;
    },
    setsentInviteResult: (state, action) => {
      state.inviteWorkerResult = action.payload;
    },
  },
});

const viewPostedJobSlice = createSlice({
  name: "viewPostedJob",
  initialState: {
    jobs: [],
    jobId: null,
    jobApplications: [],
    show: false,
    showInviteModal: false,
    InviteModalMessage: "",
    InviteModalConfirmation: false,
    InviteModalConfirmationJobId: 0,
    confirmationIndexJob: {},
    inviteWorker: "",
    inviteWorkerResult: "",
    inviteWorkererror: "",
    inviteWorkersuccessmodel: false,
    openSnackbarError: false,
    inviteStatus: [],
    showCloseButton: false,
    openJobEditModal:false,
    JobEditId:'',
    openJobDeleteModal:false,
    JobDeleteId:'',
    postjobopenmodel:false,
  },
  reducers: {
    setViewPostedJobs: (state, action) => {
      state.jobs = action.payload;
    },
    setViewPostedJobId: (state, action) => {
      state.jobId = action.payload;
    },
    setViewPostedJobsApplications: (state, action) => {
      state.jobApplications = action.payload;
    },
    setShowApplicants: (state, action) => {
      state.show = action.payload;
    },
    setInviteModal: (state, action) => {
      state.showInviteModal = action.payload;
    },
    setInviteModalMessage: (state, action) => {
      state.InviteModalMessage = action.payload;
    },
    setInviteModalConfirmation: (state, action) => {
      state.InviteModalConfirmation = action.payload;
    },
    setInviteModalConfirmationJobId: (state, action) => {
      state.InviteModalConfirmationJobId = action.payload;
    },
    setInviteModalConfirmationJob: (state, action) => {
      state.confirmationIndexJob = action.payload;
    },
    setInviteWorker: (state, action) => {
      state.inviteWorker = action.payload;
    },
    setsentInviteResult: (state, action) => {
      state.inviteWorkerResult = action.payload;
    },
    errorInviteResult: (state, action) => {
      state.inviteWorkererror = action.payload;
    },
    inviteJobSuccessModel: (state, action) => {
      state.inviteWorkersuccessmodel = action.payload;
    },
    openSnackbarError: (state, action) => {
      state.openSnackbarError = action.payload;
    },
    setInvitesStatus: (state, action) => {
      state.inviteStatus = action.payload;
    },
    setInviteShowCloseButton: (state, action) => {
      state.showCloseButton = action.payload;
    },
    setOpenJobEditModal:(state, action) => {
      state.openJobEditModal = action.payload;
    },
    setEditJobId:(state, action) => {
      state.JobEditId = action.payload;
    },
    setOpenJobDeleteModal:(state, action) => {
      state.openJobDeleteModal = action.payload;
    },
    setDeleteJobId:(state, action) => {
      state.JobDeleteId = action.payload;
    },
    setOpenPostJobModal:(state, action) => {
      state.postjobopenmodel = action.payload;
    },

  },
});

const availableJobSlice = createSlice({
  name: "job",
  initialState: {
    jobs: [],
    jobId: null,
    loggedWorker:{},
    loggedSeeker:{},
  },
  reducers: {
    setAvailableJobs: (state, action) => {
      state.jobs = action.payload;
    },
    setJobId: (state, action) => {
      state.jobId = action.payload;
    },
    setfirstPageWorker:(state, action) => {
      state.loggedWorker = action.payload;
    },
    setfirstPageSeeker:(state, action) => {
      state.loggedSeeker = action.payload;
    },
  },
});

const receiveInviteSlice = createSlice({
  name: "receiveJobInvite",
  initialState: {
    invites: [],
    updatedStatus: "",
    rejectInvites: false,
  },
  reducers: {
    setReceivedInvites: (state, action) => {
      state.invites = action.payload;
    },
    setUpdatedStatus: (state, action) => {
      state.updatedStatus = action.payload;
    },
    rejectInvites: (state, action) => {
      state.rejectInvites = action.payload;
    },
  },
});


const postingJobSlice = createSlice({
  name: "postingJob",
  initialState: {
    postingJobText: {
      requiredService: "",
      detail: "",
      address: "",
      hourlyBudget: "",
      timeOfService: "",
    },
    result: "",
    error: "",
    isSuccessModel: null,
    openSnackbar: false,
    applyjobModel  :false
  },
  reducers: {
    setPostingJobs: (state, action) => {
      state.postingJobText = { ...state.postingJobText, ...action.payload };
    },
    resetPostingJobs: (state) => {
      state.postingJobText = {
        // Reset to the initial state directly
        requiredService: "",
        detail: "",
        address: "",
        hourlyBudget: "",
        timeOfService: "",
      };
    },
    postJobResult: (state, action) => {
      state.result = action.payload;
    },
    errorJobResult: (state, action) => {
      state.error = action.payload;
    },
    postJobSuccessModel: (state, action) => {
      state.isSuccessModel = action.payload;
    },
    openSnackbarError: (state, action) => {
      state.openSnackbar = action.payload;
    },
    openApplyJobModel: (state, action) => {
      state.applyjobModel = action.payload;
    },
    
  },
});
const applyJobSlice = createSlice({
  name: "applyjob",
  initialState: {
    applyJobData: {
      jobId: "",
      category: "",
      experience: "",
      hourlyRate: "",
      mobileNo: "",
    
    },
    applyJobResult: "",
    error: "",
    isSuccessModel: null,
    openSnackbar: false,
    applyjobModel:false
  },
  reducers: {
    setApplyJobsData: (state, action) => {
      state.applyJobData = { ...state.applyJobData, ...action.payload };
    },
    setPictureData: (state, action) => {
      // Action.payload should be an object with file metadata
      state.applyJobData = { ...state.applyJobData, ...action.payload };
    },
    setApplyJobResult: (state, action) => {
      state.applyJobResult = action.payload;
    },
    errorJobResult: (state, action) => {
      state.error = action.payload;
    },
    postJobSuccessModel: (state, action) => {
      state.isSuccessModel = action.payload;
    },
    openSnackbarError: (state, action) => {
      state.openSnackbar = action.payload;
    },
    openApplyJobModel: (state, action) => {
      state.applyjobModel = action.payload;
    },
    resetPostingJobs: (state) => {
      state.applyJobData = {
        // Reset to the initial state directly
        category: "",
        experience: "",
        hourlyRate: "",
        mobileNo: "",
      };
    },
  },
});

const updateProfileSlice = createSlice({
  name:'updateProfile',
  initialState:{
    openUpdateModal:false,
    openeditmodal:false,
    opendeletemodal:false,
    opensidebar:false,
    openeditworkermodal :false
  },
  reducers:{
    SetOpenUpdateModal: (state, action) => {
      state.openUpdateModal = action.payload;
    },
    SetOpenEditModel:(state, action) => {
      state.openeditmodal = action.payload;
    },
    SetOpenEditWorkerModel:(state, action) => {
      state.openeditworkermodal = action.payload;
    },
    SetOpenDeleteModel:(state, action) => {
      state.opendeletemodal = action.payload;
    },
    SetOpenSidebar:(state, action) => {
      state.opensidebar = action.payload;
    },
  
  }
})

const sidebarSlice = createSlice({
  name:'sidebar',
  initialState:{
    sidebarWidth:60,
    opensidebar:false,
    opensidebartwo:true,
    someShow:false,
    someWidth:'5%'
  },
  reducers:{
    SetSidebarWidth:(state, action) => {
      state.sidebarWidth = action.payload;
    },
    SetOpenSidebar:(state, action) => {
      state.opensidebar = action.payload;
    },
    SetOpenSidebarTwo:(state, action) => {
      state.opensidebartwo = action.payload;
    },
    setSomeShow:(state, action) => {
      state.someShow = action.payload;
    },
    setSomeWidth:(state, action) => {
      state.someWidth = action.payload;
    },
  }
});


const store = configureStore({
  reducer: {
    chat: messageSlice.reducer, // Corrected slice name to 'chat'
    availableJobs: availableJobSlice.reducer,
    applyjob: applyJobSlice.reducer,
    postingJob: postingJobSlice.reducer,
    filterWorker: filterWorkerSlice.reducer,
    viewPostedJobs: viewPostedJobSlice.reducer,
    receiveJobInvite: receiveInviteSlice.reducer,
    updateProfile:updateProfileSlice.reducer,
    sidebar:sidebarSlice.reducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const sidebarActions = sidebarSlice.actions;
export const messageActions = messageSlice.actions;
export const availableJobsActions = availableJobSlice.actions;
export const applyJobActions = applyJobSlice.actions;
export const postingJobActions = postingJobSlice.actions;
export const filterWorkerActions = filterWorkerSlice.actions;
export const viewPostedJobsActions = viewPostedJobSlice.actions;
export const receiveInvitesActions = receiveInviteSlice.actions;
export const updateProfileActions = updateProfileSlice.actions;
export default store;
