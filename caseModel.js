import mongoose from 'mongoose';

const caseSchema = new mongoose.Schema({
    cnr: {
        required: true,
        type: String
    },
    first_hearing: {
        required: false,
        type: Date,
        default: Date.now()
    },
    next_hearing: {
        required: false,
        type: Date,
        default: Date.now()
    },
    stage: {
        required: true,
        type: String
    },
    court_no_and_judge: {
        required: true,
        type: String
    }
})

export default mongoose.model('Data', caseSchema);