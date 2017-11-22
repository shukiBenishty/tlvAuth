import React from 'react';
import ReactDom from 'react-dom';
import { connect } from 'react-redux';
import classNames from 'classnames';
import axios from 'axios';

class Sms extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            error: '',
            responseStatus:'',
            disabled: '',
            loading: false,
            loadStyles: ''
        };

        this.styles = {

            errorStyle: {
                color: 'red'
            },
            initialStyle: {
                visibility: 'collapse'
            },
            messageStyle: {
                visibility: 'visible'
            }

        };


        this.send = this.sendOTP.bind(this);

        this.userIdChanged = this.inputId.bind(this);
        this.phoneNumber = this.phoneNumber.bind(this);

    };

    componentWillReceiveProps(nextProps) {
        // Received from Redux
        console.log('PID: ' + this.props.personalId);
        console.log('Phone: ' + this.props.phone);
    }

    sendOTP(event) {

        event.preventDefault();

        this.setState({
            error: '',
            disabled: 'disabled',
            loading: true,
            responseStatus: ''
        });

        axios.get('https://api.tel-aviv.gov.il/auth/api/otp?id=' + this.props.personalId + '&phoneNum=' + this.props.phone)
        .then(result => {

            this.props.router.push('/otp');
            this.setState({
                loading: false,
            });
        })
        .catch(e => {

            console.log(e.message);

            this.setState({
                error: e.message,
                responseStatus: 'error',
                disabled: 'disabled',
                loading: false
            });

        });

    };

    inputId(evt) {
        console.log(evt.keyCode);

        this.setState({
            error: '',
            disabled: '',
            responseStatus: ''
        });

        // Use Redux store instead of local state
        this.props.dispatch({
            type: 'PID_CHANGED',
            data: {
                pid: evt.target.value
            }
        });
    };

    phoneNumber(evt) {

        this.setState({
            error: '',
            disabled: '',
            responseStatus: ''
        });

        // Use Redux store instead of local state
        this.props.dispatch({
            type: 'PHONE_CHANGED',
            data: {
                phone: evt.target.value
            }
        });
    };

    render() {

        var alertClassNames = classNames('alert',
           { 'alert-success': this.state.responseStatus === 'success' },
           { 'alert-warning': this.state.responseStatus === 'warning' },
           { 'alert-danger': this.state.responseStatus === 'error' });

        var currentStyle = (this.state.responseStatus != '') ? this.styles.messageStyle : this.styles.initialStyle;

        var loaderClass = classNames('fa',
                            { 'fa-spinner': this.state.loading },
                            { 'fa-spin': this.state.loading });

        return (<form onSubmit={this.send} action="">
        <div className="container">
                    <div id="header">
                        <img className="img-responsive" src="https://ssop.tel-aviv.gov.il/adfs/portal/logo/logo.png?id=0B71356A5543693C0A85C7F7D64B538D7D31C575B4CDB4EF8F4F618C9C334B75" />
                    </div>
                    <div className="has-feedback">
                        <input type="number" pattern="\d*" className="form-control"
                               required="true" value={this.props.personalId}
                               placeholder="יש להקליד מספר זהות" onChange={this.userIdChanged} />
                        <i className="form-control-feedback fa fa-user-o" aria-hidden="true"></i>
                    </div>

                    <br />
                    <div className="has-feedback">
                        <input type="number" pattern="\d*" className="form-control" placeholder="יש להקליד מספר טלפון"
                               required="true" value={this.props.phone}
                               onChange={this.phoneNumber} />
                        <i className="form-control-feedback fa fa-mobile" aria-hidden="true"></i>
                    </div>
                    <br />
                    <div className="row justify-content-md-center">
                        <div className="col col-md-12">
                            <button type="submit" className="btn btn-primary btn-lg"
                                    disabled={this.state.disabled}>
                                <span className="spanBtnText">שלח קוד</span>
                                <span className="spinner"><i className={loaderClass}></i></span>
                            </button>
                        </div>
                    </div>
                    <br />
                    <div className={alertClassNames} role="alert" style={currentStyle}>{this.state.error}</div>
        </div>
        </form>);

    }

};

const mapStateToProps = state =>
{
    return {
        urlParams: state.urlParams,
        personalId: state.personalId,
        phone: state.phone
    }
};

export default connect(mapStateToProps)(Sms);
