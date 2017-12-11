import {connect} from 'react-redux';
import Download from '../components/Download';
import {actions} from '../modules/download';

function mapStateToProps(state) {
  return {
    ...state.download,
  };
}

export default connect(mapStateToProps, actions)(Download);
