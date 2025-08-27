import { Meta, StoryObj} from '@storybook/react';
import { Child } from './child';

const meta: Meta<typeof Child> = {
    title: 'Example/child',
    component: Child,
    tags: ['autodocs'],
    argTypes: {
        name: {
            control: 'text',
        },
    },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        name: 'child',
    },
};

export const WithLongName: Story = {
    args: {
        name: 'child with long name',
    },
};
