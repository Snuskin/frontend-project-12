import React from "react";
import {emitNewChannel, emitRenameChannel, emitRemoveChannel} from '../sockets/emits';
import { useSelector, useDispatch } from 'react-redux';
import { closeModal } from '../slices/modalsSlice';
import { useTranslation } from 'react-i18next';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import filter from 'leo-profanity';

const Modal = () => {

    const { t } = useTranslation();
    filter.add(filter.getDictionary('ru'))
    const type = useSelector((state) => state.modals.modal.type);
    const extra = useSelector((state) => state.modals.modal.extra);
    const isOpen = useSelector((state) => state.modals.modal.isOpenend);
    const dispatch = useDispatch();

     const showToaster = (status) => {
        switch(status) {
            case 'add':
                toast.success(`${t('toasters.added')}`, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    });
                break;
            case 'rename':
                toast.success(`${t('toasters.renamed')}`, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    });
                break;
            case 'remove':
                toast.success(`${t('toasters.removed')}`, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    });
                break;
            case 'error':
                toast.error(`${t('toasters.networkError')}`, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    });
            default:
                return `Unexpected toaster status: ${status}`
        }
    };

    const sendNewChannel = (e) => {
        e.preventDefault()
        if (e.target.channelName.value.length > 2) {
            try {
                emitNewChannel(filter.clean(e.target.channelName.value))
                showToaster('add')
            } catch (e) {
                console.log(e)
                showToaster('error')
            }
        }
        dispatch(closeModal(false));
    };

    const renderRenamedChannel = (e, id) => {
        e.preventDefault()
        if (e.target.channelName.value.length > 2) {
            try {
                emitRenameChannel(id, filter.clean(e.target.channelName.value))
                showToaster('rename')
            } catch (e) {
                console.log(e)
                showToaster('error')
            }
        }
    };

    const sendRemovingChannel = (extra) => {
        try {
            emitRemoveChannel(extra);
            showToaster('remove');
        } catch (e) {
            console.log(e)
            showToaster('error');
        }
    };

    const pickModal = (type, extra) => {
        switch(type) {
            case 'addChannel':
                return <>
                <div className="modal-header">
                <div>{t("modals.addChannel.title")}</div>
                <button className="modal-close-btn" onClick={() => dispatch(closeModal())}>X</button>
            </div>
            <div className="modal-body">
                <form onSubmit={(e) => {sendNewChannel(e); dispatch(closeModal())}} id='add-modal-form' className="modal-form" action="">
                    <input name='channelName' type="text" />
                    <div className="modal-btns">
                        <button type="button" onClick={() => {dispatch(closeModal());}} className="cancel-btn">{t('modals.addChannel.cancelBtn')}</button>
                        <button type="submit" className="commit-btn">{t('modals.addChannel.confirmBtn')}</button>
                    </div>
                </form>
            </div>
            </>
            case 'removeChannel':
                return <>             
                <div className="modal-header">
                <div>{t('modals.removeChannel.title')}</div>
                <button className="modal-close-btn" onClick={() => dispatch(closeModal())}>X</button>
            </div>
            <div className="modal-body">
                <div>{t('modals.removeChannel.subTitle')}</div>
                    <div className="modal-btns">
                        <button type="button" onClick={() => dispatch(closeModal())} className="cancel-btn">{t('modals.removeChannel.cancelBtn')}</button>
                        <ToastContainer />
                        <button type="submit" onClick={() => {sendRemovingChannel(extra); dispatch(closeModal())}} className="commit-btn">{t('modals.removeChannel.confirmBtn')}</button>
                    </div>
            </div>
            </>
            case 'renameChannel':
                return <>             
                <div className="modal-header">
                <div>{t('modals.renameChannel.title')}</div>
                <button className="modal-close-btn" onClick={() => dispatch(closeModal())}>X</button>
            </div>
            <div className="modal-body">
                <form onSubmit={(e) => {renderRenamedChannel(e, extra); dispatch(closeModal())}} id='add-modal-form' className="modal-form" action="">
                    <input name='channelName' type="text" />
                    <div className="modal-btns">
                        <button type="button" onClick={() => dispatch(closeModal())} className="cancel-btn">{t('modals.renameChannel.cancelBtn')}</button>
                        <ToastContainer />
                        <button type="submit" className="commit-btn">{t('modals.renameChannel.confirmBtn')}</button>
                        
                    </div>
                </form>
            </div>
            </>
            default:
                return 
        };
    };

    const renderModal = (type, extra) => {
        return (
            <div className="modal-content" onClick={(e) => {e.stopPropagation()}}>
                    {pickModal(type, extra)}
            </ div>
        )
    };

    return (
        <div className={isOpen === true ? 'modal active' : 'modal'} onClick={() => dispatch(closeModal(false))}>
                {renderModal(type, extra)}
        </div>
    )
};

export default Modal