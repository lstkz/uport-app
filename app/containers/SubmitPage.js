import {connect} from 'react-redux';
import Submit from '../components/Submit';
import {actions} from '../modules/submit';

function mapStateToProps(state) {
  return {
    ...state.submit,
  };
}

export default connect(mapStateToProps, actions)(Submit);
