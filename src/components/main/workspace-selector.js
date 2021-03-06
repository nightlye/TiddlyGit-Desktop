import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import Badge from '@material-ui/core/Badge';

import connectComponent from '../../helpers/connect-component';

import defaultIcon from '../../images/default-icon.png';

const styles = theme => ({
  root: {
    height: 68,
    width: 68,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    fontFamily: theme.typography.fontFamily,
    outline: 'none',
    '&:hover': {
      background: theme.palette.action.hover,
      cursor: 'pointer',
      opacity: 1,
    },
    WebkitAppRegion: 'no-drag',
    opacity: 0.8,
    position: 'relative',
    borderLeft: '4px solid',
    borderColor: 'transparent',
  },
  rootHibernate: {
    opacity: 0.4,
  },
  rootActive: {
    borderColor: theme.palette.type === 'dark' ? theme.palette.common.white : theme.palette.common.black,
    opacity: 1,
  },
  avatar: {
    height: 36,
    width: 36,
    background: theme.palette.type === 'dark' ? theme.palette.common.black : theme.palette.common.white,
    borderRadius: 4,
    color: theme.palette.getContrastText(
      theme.palette.type === 'dark' ? theme.palette.common.black : theme.palette.common.white,
    ),
    lineHeight: '36px',
    textAlign: 'center',
    fontWeight: 500,
    textTransform: 'uppercase',
    border: theme.palette.type === 'dark' ? 'none' : '1px solid rgba(0, 0, 0, 0.12)',
    overflow: 'hidden',
  },
  avatarLarge: {
    height: 44,
    width: 44,
    lineHeight: '44px',
  },
  avatarPicture: {
    height: 36 - 2,
    width: 36 - 2,
  },
  avatarPictureLarge: {
    height: 44,
    width: 44,
  },
  transparentAvatar: {
    background: 'transparent',
    border: 'none',
    borderRadius: 0,
  },
  addAvatar: {
    background: theme.palette.type === 'dark' ? theme.palette.common.white : theme.palette.common.black,
    color: theme.palette.getContrastText(
      theme.palette.type === 'dark' ? theme.palette.common.white : theme.palette.common.black,
    ),
  },
  shortcutText: {
    marginTop: 2,
    marginBottom: 0,
    padding: 0,
    fontSize: '12px',
    fontWeight: 500,
    color: theme.palette.text.primary,
  },
  badge: {
    lineHeight: '20px',
  },
});

function WorkspaceSelector({
  active,
  badgeCount,
  classes,
  hibernated,
  id,
  onClick,
  onContextMenu,
  order,
  picturePath,
  sidebarShortcutHints,
  transparentBackground,
}) {
  const { t } = useTranslation();
  return (
    <div
      role="button"
      className={classNames(classes.root, hibernated && classes.rootHibernate, active && classes.rootActive)}
      onClick={onClick}
      onKeyDown={null}
      onContextMenu={onContextMenu}
      tabIndex="0"
    >
      <Badge color="secondary" badgeContent={badgeCount} max={99} classes={{ badge: classes.badge }}>
        <div
          className={classNames(
            classes.avatar,
            !sidebarShortcutHints && classes.avatarLarge,
            transparentBackground && classes.transparentAvatar,
            id === 'add' && classes.addAvatar,
          )}
        >
          {id !== 'add' ? (
            <img
              alt="Icon"
              className={classNames(classes.avatarPicture, !sidebarShortcutHints && classes.avatarPictureLarge)}
              src={picturePath ? `file:///${picturePath}` : defaultIcon}
              draggable={false}
            />
          ) : (
            '+'
          )}
        </div>
      </Badge>
      {sidebarShortcutHints && (id === 'add' || order < 9) && (
        <p className={classes.shortcutText}>
          {id === 'add' ? t('WorkspaceSelector.Add') : `${window.remote.getPlatform() === 'darwin' ? '⌘' : 'Ctrl'} + ${order + 1}`}
        </p>
      )}
    </div>
  );
}

WorkspaceSelector.defaultProps = {
  active: false,
  badgeCount: 0,
  hibernated: false,
  onContextMenu: null,
  order: 0,
  picturePath: null,
  transparentBackground: false,
};

WorkspaceSelector.propTypes = {
  active: PropTypes.bool,
  badgeCount: PropTypes.number,
  classes: PropTypes.object.isRequired,
  hibernated: PropTypes.bool,
  id: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  onContextMenu: PropTypes.func,
  order: PropTypes.number,
  picturePath: PropTypes.string,
  sidebarShortcutHints: PropTypes.bool.isRequired,
  transparentBackground: PropTypes.bool,
};

const mapStateToProps = (state, ownProps) => ({
  badgeCount: state.workspaceMetas[ownProps.id] ? state.workspaceMetas[ownProps.id].badgeCount : 0,
  sidebarShortcutHints: state.preferences.sidebarShortcutHints,
});

export default connectComponent(WorkspaceSelector, mapStateToProps, null, styles);
