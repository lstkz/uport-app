import { connect } from 'react-redux';
import Home from '../components/Home';
import {actions} from '../modules/auth';

function mapStateToProps(state) {
  return state.auth;
}

export default connect(mapStateToProps, actions)(Home);
