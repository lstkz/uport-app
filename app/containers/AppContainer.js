import { connect } from 'react-redux';
import App from '../components/App';
import {actions} from '../modules/auth';

function mapStateToProps(state) {
  return {
    user: state.auth.user,
  };
}

export default connect(mapStateToProps, actions)(App);
