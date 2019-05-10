import React, { Component } from "react";
import { Tasks } from "../api/tasks.js";
import { Meteor } from "meteor/meteor";
import classnames from "classnames";
export default class Task extends Component {
    toggleChecked = () => {
        Meteor.call('tasks.setChecked', this.props.task._id, !this.props.task.checked)
        Tasks.update(this.props.task._id, {
            $set: { checked: !this.props.task.checked }
        })
    }

    deleteThisTask = () => {
        Meteor.call('tasks.remove', this.props.task._id)
        Tasks.remove(this.props.task._id)
    }

    togglePrivate = () => {
        Meteor.call('tasks.setPrivate', this.props.task._id, !this.props.task.private)
    }

    render() {
        const taskClassName = classnames({
            checked: this.props.task.checked,
            private: this.props.task.private
        })
        return (
            <li className={taskClassName}>
                <button className='delete' onClick={this.deleteThisTask}>
                    &times;
                </button>
                <input
                    type='checkbox'
                    readOnly
                    checked={!!this.props.task.checked}
                    onClick={this.toggleChecked}
                />

                {
                    this.props.showPrivateButton ? (
                        <button className='toggle-private' onClick={this.togglePrivate}>
                            {this.props.task.private ? 'Private' : 'Public'}
                        </button>
                    ) : ''
                }

                <span className='text'>
                    <strong>{this.props.task.username}</strong>: {this.props.task.text}
                </span>

            </li>
        )
    }
}