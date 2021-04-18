import React, {Component} from 'react'
import moment from 'moment'
import {Formik, Form, Field, ErrorMessage} from 'formik'
import TodoDataService from '../../api/todo/TodoDataService'
import AuthenticationService from './AuthenticationService.js'

class TodoComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            id : this.props.match.params.id,
            description : '',
            targetDate : moment(new Date()).format('YYYY-MM-DD')
        }
        this.onSubmit=this.onSubmit.bind(this)
    }

    componentDidMount() {

        if(this.state.id===-1) {
            return
        }

        let username = AuthenticationService.getLoggedInUsername()
        TodoDataService.retrieveTodo(username, this.state.id)
            .then(response => this.setState({
                        description: response.data.description,
                        targetDate:moment(response.data.targetDate).format('YYYY-MM-DD')
                }))
    }
    onSubmit(values) {
        let username = AuthenticationService.getLoggedInUsername()

        let todo = {
            id: this.state.id,
            description: values.description,
            targetDate: values.targetDate
        }
        if (this.state.id === -1) {
            TodoDataService.updateTodo(username, todo).then(() => this.props.history.push('/todos'))
        } else {
            TodoDataService.updateTodo(username, this.state.id, todo).then(() => this.props.history.push('/todos'))
        }
    }

    validate(values) {
        let errors = {}
        if(!values.description) {
            errors.description = "Please enter the description as it can't be left empty! "
        } else if(values.description.length<5) {
            errors.description = "The length of the Description should be atleast 5 Characters! "
        }

        if(!moment(values.targetDate).isValid()) {
            errors.targetDate = "Please enter a Valid Target Date! " 
        }
        return errors
    }
    render() {

        let {description,targetDate} = this.state
        return (
            <div>
                <h1>Todo</h1>
                <div className="container">
                    <Formik
                        initialValues = {{description,targetDate}}
                        onSubmit = {this.onSubmit}
                        validateOnChange = {false}
                        validateOnBlur = {false}
                        validate={this.validate}
                        enableReinitialize= {true}
                    >
                        {
                            (props) => (
                                <Form>
                                    <ErrorMessage name="description" component="div" className="alert alert-warning"/>
                                    <ErrorMessage name="targetDate" component="div" className="alert alert-warning"/>
                                    <fieldset className="form-group">
                                        <label>Description</label>
                                        <Field className="form-control" type="text" name="description"></Field>
                                    </fieldset>
                                    <fieldset className="form-group">
                                        <label>Target Date</label>
                                        <Field className="form-control" type="date" name="targetDate"></Field>
                                    </fieldset>
                                    <button className="btn btn-success" type="submit">Save</button>
                                </Form>
                            )
                        }
                    </Formik>
                </div>
            </div>
        )
    }
}

export default TodoComponent
