import { title } from 'process';
import { FileQuestion, MailQuestion, MessageCircleIcon } from 'lucide-react';

import { AskQuestionButtonNodeType } from '../node-component/ask.question.button.node.type';
import { AskQuestionListNodeType } from '../node-component/ask.question.list.node.type';
import { AskQuestionNodeType } from '../node-component/ask.question.node.type';
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
        title: 'Ask a question',
        icon: <MailQuestion size={18} />,
        description: 'Ask question and store user input in variable',
        color: 'bg-orange',
        nodeComponent: AskQuestionNodeType,
    },
    ask_question_button: {
        identifier: 'ask_question_button',
        title: 'Ask a question',
        icon: <MailQuestion size={18} />,
        description: 'Ask question and store user input in variable',
        color: 'bg-orange',
        nodeComponent: AskQuestionButtonNodeType,
    },
    ask_question_list: {
        identifier: 'ask_question_list',
        title: 'Ask a question',
        icon: <MailQuestion size={18} />,
        description: 'Ask question and store user input in variable',
        color: 'bg-orange',
        nodeComponent: AskQuestionListNodeType,
    },
    set_condition: {
        identifier: 'set_condition',
        title: 'Set a condition',
        icon: <FileQuestion size={18} />,
        description: 'Send message(s) based on logical condition(s)',
        color: 'bg-red-500',
        nodeComponent: SetConditionNodeType,
    },
};

export type FlowBuilderPanelCardType = keyof typeof FlowBuilderCardConstants;
