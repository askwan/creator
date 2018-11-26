import { t } from '../util/locale';
import { actionAddEntity,actionChangePreset } from '../actions';
import { behaviorDraw } from '../behavior';
import { modeBrowse, modeSelect } from './index';
import { osmNode } from '../osm';


export function modeAddPoint(context) {
    var mode = {
        id: 'add-point',
        button: 'point',
        title: t('modes.add_point.title'),
        description: t('modes.add_point.description'),
        key: '1'
    };

    var behavior = behaviorDraw(context)
        .tail(t('modes.add_point.tail'))
        .on('click', add)
        .on('clickWay', addWay)
        .on('clickNode', addNode)
        .on('cancel', cancel)
        .on('finish', cancel);


    function add(loc) {
        var node = osmNode({ loc: loc });
        console.log(loc,'loc')
        console.log(node,'node')
        context.perform(
            actionAddEntity(node),
            t('operations.add.annotation.point')
        );

        context.enter(
            modeSelect(context, [node.id]).newFeature(true)
        );
        // context.selectEle(node.id);
        console.log('complate-point')
    }


    function addWay(loc) {
        add(loc);
    }


    function addNode(node) {
        add(node.loc);
    }


    function cancel() {
        context.enter(modeBrowse(context));
    }


    mode.enter = function() {
        context.install(behavior);
    };


    mode.exit = function() {
        context.uninstall(behavior);
    };


    return mode;
}
