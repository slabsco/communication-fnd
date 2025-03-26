import {
    Circle,
    Clock,
    Equal,
    List,
    MessageCircleIcon,
    ShieldQuestion,
    UserIcon,
} from 'lucide-react';

import { AddTimeDelayNodeType } from '../node-component/add.time.delay.node.type';
import { AskQuestionButtonNodeType } from '../node-component/ask.question.button.node.type';
import { AskQuestionListNodeType } from '../node-component/ask.question.list.node.type';
import { AskQuestionNodeType } from '../node-component/ask.question.node.type';
import { AssignUserNodeType } from '../node-component/assign.user.node.type';
import { SendMessageNode } from '../node-component/send.message.node.type';
import SetConditionNodeType from '../node-component/set.condition.node.type';

export const FlowBuilderCardConstants = {
    send_message: {
        identifier: 'send_message',
        title: 'Send Message',
        icon: <MessageCircleIcon size={18} />,
        description: 'Some description Here',
        color: 'bg-red-400',
        nodeComponent: SendMessageNode,
    },
    ask_question: {
        identifier: 'ask_question',
        title: 'Question',
        icon: <ShieldQuestion size={18} />, // Existing icon for Question
        description: 'Ask any thing to the user',
        color: 'bg-orange',
        nodeComponent: AskQuestionNodeType,
    },
    ask_question_button: {
        identifier: 'ask_question_button',
        title: 'Buttons',
        icon: <Circle size={18} />, // Existing icon for Question
        description: 'Choices based on buttons (Maximum of 3 choices)',
        color: 'bg-orange',
        nodeComponent: AskQuestionButtonNodeType,
    },
    ask_question_list: {
        identifier: 'ask_question_list',
        title: 'List',
        icon: <List size={18} />, // Updated icon for List
        description: 'Choices based on buttons (Maximum of 10 choices)',
        color: 'bg-orange',
        nodeComponent: AskQuestionListNodeType,
    },
    set_condition: {
        identifier: 'set_condition',
        title: 'Set a condition',
        icon: <Equal size={18} />,
        description: 'Send message(s) based on logical condition(s)',
        color: 'bg-red-500',
        nodeComponent: SetConditionNodeType,
    },
    assign_user: {
        identifier: 'assign_user',
        title: 'Assign User',
        icon: <UserIcon size={20} />,
        color: 'text-white bg-blue-500',
        description: undefined,
        nodeComponent: AssignUserNodeType,
    },
    set_time_delay: {
        identifier: 'set_time_delay',
        title: 'Time Delay',
        icon: <Clock size={20} />,
        description: undefined,
        color: 'text-white bg-pink-500',
        nodeComponent: AddTimeDelayNodeType,
    },
};

export type FlowBuilderPanelCardType = keyof typeof FlowBuilderCardConstants;
