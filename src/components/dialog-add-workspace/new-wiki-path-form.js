// @flow
import type { ComponentType } from 'react';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useTranslation } from 'react-i18next';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FolderIcon from '@material-ui/icons/Folder';
import Autocomplete from '@material-ui/lab/Autocomplete';

import * as actions from '../../state/dialog-add-workspace/actions';

import { getWorkspaces } from '../../senders';

const CreateContainer: ComponentType<{}> = styled(Paper)`
  margin-top: 5px;
`;
const LocationPickerContainer = styled.div`
  display: flex;
  flex-direction: row;
`;
const LocationPickerInput = styled(TextField)``;
const LocationPickerButton = styled(Button)`
  white-space: nowrap;
  width: fit-content;
`;
const SoftLinkToMainWikiSelect = styled(Select)`
  width: 100%;
`;
const SoftLinkToMainWikiSelectInputLabel = styled(InputLabel)`
  margin-top: 5px;
`;

type OwnProps = {|
  parentFolderLocationSetter: string => void,
  wikiFolderName: string,
  wikiFolderNameSetter: string => void,
  tagName: string,
  tagNameSetter: string => void,
  mainWikiToLink: Object,
  mainWikiToLinkSetter: Object => void,
  parentFolderLocation: string,
  wikiPort: number,
  wikiPortSetter: number => void,
  fileSystemPaths: { tagName: string, folderName: string }[],
  isCreateMainWorkspace: boolean,
|};
type DispatchProps = {|
  setWikiCreationMessage: string => void,
|};
type StateProps = {|
  wikiCreationMessage?: string,
|};
type Props = { ...OwnProps, ...DispatchProps, ...StateProps };

function NewWikiPathForm({
  setWikiCreationMessage,
  wikiCreationMessage = '',
  parentFolderLocation,
  parentFolderLocationSetter,
  tagName,
  tagNameSetter,
  wikiFolderName,
  wikiFolderNameSetter,
  mainWikiToLink,
  mainWikiToLinkSetter,
  wikiPort,
  wikiPortSetter,
  fileSystemPaths,
  isCreateMainWorkspace,
}: Props) {
  const [workspaces, workspacesSetter] = useState({});
  useEffect(() => {
    workspacesSetter(getWorkspaces());
  }, []);

  const hasError = wikiCreationMessage.startsWith('Error');
  const { t } = useTranslation();
  return (
    <CreateContainer elevation={2} square>
      <LocationPickerContainer>
        <LocationPickerInput
          error={hasError}
          helperText={hasError ? wikiCreationMessage : ''}
          fullWidth
          onChange={event => {
            parentFolderLocationSetter(event.target.value);
            setWikiCreationMessage('');
          }}
          label={t('AddWorkspace.WorkspaceFolder')}
          value={parentFolderLocation}
        />
        <LocationPickerButton
          onClick={() => {
            const { dialog } = window.remote;
            // eslint-disable-next-line promise/catch-or-return
            dialog
              .showOpenDialog({
                properties: ['openDirectory'],
              })
              .then(({ canceled, filePaths }) => {
                // eslint-disable-next-line promise/always-return
                if (!canceled && filePaths.length > 0) {
                  parentFolderLocationSetter(filePaths[0]);
                }
              });
          }}
          variant="outlined"
          color={parentFolderLocation ? 'default' : 'primary'}
          disableElevation
          endIcon={<FolderIcon />}
        >
          <Typography variant="button" display="inline">
            {t('AddWorkspace.Choose')}
          </Typography>
        </LocationPickerButton>
      </LocationPickerContainer>
      <LocationPickerInput
        error={hasError}
        fullWidth
        onChange={event => {
          wikiFolderNameSetter(event.target.value);
          setWikiCreationMessage('');
        }}
        label={t('AddWorkspace.WorkspaceFolderNameToCreate')}
        value={wikiFolderName}
      />
      {isCreateMainWorkspace && (
        <LocationPickerInput
          fullWidth
          onChange={event => {
            wikiPortSetter(event.target.value);
          }}
          label={t('AddWorkspace.WikiServerPort')}
          value={wikiPort}
        />
      )}
      {!isCreateMainWorkspace && (
        <>
          <SoftLinkToMainWikiSelectInputLabel id="main-wiki-select-label">
            {t('AddWorkspace.MainWorkspaceLocation')}
          </SoftLinkToMainWikiSelectInputLabel>
          <SoftLinkToMainWikiSelect
            labelId="main-wiki-select-label"
            id="main-wiki-select"
            value={mainWikiToLink}
            onChange={event => mainWikiToLinkSetter(event.target.value)}
          >
            {Object.keys(workspaces).map(workspaceID => (
              <MenuItem key={workspaceID} value={workspaces[workspaceID]}>
                {workspaces[workspaceID].name}
              </MenuItem>
            ))}
          </SoftLinkToMainWikiSelect>
          {mainWikiToLink.name && (
            <FormHelperText>
              <Typography variant="body1" display="inline" component="span">
                {t('AddWorkspace.SubWorkspaceWillLinkTo')}
              </Typography>
              <Typography
                variant="body2"
                component="span"
                noWrap
                display="inline"
                align="center"
                style={{ direction: 'rtl', textTransform: 'none' }}
              >
                {mainWikiToLink.name}/tiddlers/{wikiFolderName}
              </Typography>
            </FormHelperText>
          )}
          <Autocomplete
            freeSolo
            options={fileSystemPaths.map(fileSystemPath => fileSystemPath.tagName)}
            value={tagName}
            onInputChange={(_, value) => tagNameSetter(value)}
            renderInput={parameters => (
              <TextField
                {...parameters}
                fullWidth
                label={t('AddWorkspace.TagName')}
                helperText={t('AddWorkspace.TagNameHelp')}
              />
            )}
          />
        </>
      )}
    </CreateContainer>
  );
}

export default connect<Props, OwnProps, _, _, _, _>(
  (state): { wikiCreationMessage?: string } => ({
    wikiCreationMessage: state.dialogAddWorkspace.wikiCreationMessage,
  }),
  dispatch => bindActionCreators(actions, dispatch),
)(NewWikiPathForm);
