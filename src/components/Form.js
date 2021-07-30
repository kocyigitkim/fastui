import React, { Component } from 'react'
import { chooseOne, getElevation, translate } from '../utils';
import Loading from './Loading'

export class FastForm extends Component {
    state = {
        loading: false
    }

    async onSubmit(action, request) {
        this.setState({ loading: true });

        console.log(action, request);
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.setState({ loading: false });
    }

    async actionOnClick(action) {
        action = action.action;

        var formData = new FormData(this.frm);
        var request = {};

        for (var entry of formData.entries()) {
            var isExists = Boolean(request[entry[0]]);
            var value = request[entry[0]];
            if (isExists) {
                request[entry[0]] = value.length >= 0 ? [...value, entry[1]] : [value, entry[1]];
            }
            else {
                request[entry[0]] = entry[1];
            }
        }


        const context = {
            action: action,
            data: request,
            submit: (() => { this.onSubmit.call(this, action, request); }).bind(this)
        };

        if (this.props.submit) {
            this.props.submit.call(this, context);
        }
        else {
            this.onSubmit.call(this, action, request);
        }
    }

    render() {
        const { title, loading, actions, headerActions, outlined, submit, elevation, elevationColor } = this.props;
        const shadowConfig = getElevation(chooseOne(elevation, 5), chooseOne(elevationColor, '#000'));
        return (
            <form ref={(r => this.frm = r)} method="post" >
                <div className="card" style={{ borderRadius: 10, boxShadow: outlined ? null : shadowConfig }}>
                    <Loading show={this.state.loading}>{translate(loading || "FORM.LOADING")}</Loading>
                    {(title || headerActions) && <div className="card-header">
                        <div style={{ display: 'flex' }}>
                            <h5 style={{ flex: 1 }} className="card-title">{translate(title)}</h5>
                            {headerActions && (<div>
                                {headerActions.map((Action, index) => <Action onClick={this.actionOnClick.bind(this, Action)} key={"k" + index} style={{ margin: 5 }} form={this}></Action>)}
                            </div>)}
                        </div>
                    </div>
                    }
                    <div className="card-body" {...this.props.cardBody}>
                        {this.props.children}
                    </div>
                    {actions && (<FastForm.Actions>
                        {actions.map((Action, index) => <Action onClick={this.actionOnClick.bind(this, Action)} key={"k" + index} style={{ margin: 5 }} form={this}></Action>)}
                    </FastForm.Actions>)}
                </div>
            </form>
        )
    }
}

FastForm.Actions = class FastFormActions extends Component {
    render() {
        return <div className="card-footer" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
            {this.props.children}
        </div>;
    }
};

FastForm.CustomAction = class FastFormCustomAction extends Component {
    render() {
        const { title, action } = this.props;
        const translated = translate(title);
        return <div style={{ display: 'contents' }}>
            <button {...{ ...this.props, form: null, title: translated }} type="button" onClick={this.props.onClick}>{this.props.children}{translated}</button>
        </div>;
    }
}

FastForm.Cancel = class FastFormCancelAction extends Component {
    static action = 'cancel';
    render() {
        return <FastForm.CustomAction className="btn btn-outline-danger" title="FORM.CANCEL" {...this.props} style={{ padding: '7px 20px', ...this.props.style }}><i className="bi bi-x-lg mr-2"></i></FastForm.CustomAction>;
    }
};

FastForm.Save = class FastFormSaveAction extends Component {
    static action = 'save';
    render() {
        return <FastForm.CustomAction className="btn btn-primary" title="FORM.SAVE" {...this.props} style={{ padding: '7px 20px', ...this.props.style }}><i className="bi bi-save mr-2"></i></FastForm.CustomAction>;
    }
};

FastForm.Delete = class FastFormDeleteAction extends Component {
    static action = 'delete';
    render() {
        return <FastForm.CustomAction className="btn btn-outline-dark" title="FORM.DELETE" {...this.props} style={{ padding: '7px 20px', ...this.props.style }}><i className="bi bi-trash mr-2"></i></FastForm.CustomAction>;
    }
}

FastForm.Edit = class FastFormEditAction extends Component {
    static action = 'delete';
    render() {
        return <FastForm.CustomAction className="btn btn-outline-primary" title="FORM.EDIT" {...this.props} style={{ padding: '7px 20px', ...this.props.style }}><i className="bi bi-pen mr-2"></i></FastForm.CustomAction>;
    }
}


FastForm.ActiveDeactive = class FastFormActiveDeactiveAction extends Component {
    static action = 'delete';
    render() {
        const { data } = this.props;
        const setState = () => {
            (data || {}).IsActive = !Boolean((data || {}).IsActive);
            this.forceUpdate();
        };
        return <FastForm.CustomAction className="btn btn-outline-dark" title={`FORM.SET.${!(data || {}).IsActive ? 'ACTIVE' : 'DEACTIVE'}`} {...this.props} onClick={setState} style={{ padding: '7px 20px', ...this.props.style }}><i className={`bi bi-${!(data || {}).IsActive ? 'eye' : 'eye-slash'} mr-2`}></i></FastForm.CustomAction>;
    }
}
