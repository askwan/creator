


import {getEditor} from '@/script/operate';

import _clone from 'lodash-es/clone';
import _forEach from 'lodash-es/forEach';
import _isEmpty from 'lodash-es/isEmpty';
import _isEqual from 'lodash-es/isEqual';
import _some from 'lodash-es/some';

import {
    event as d3_event,
    selectAll as d3_selectAll
} from 'd3-selection';

import { t, textDirection } from '@/script/editor/id-editor/modules/util/locale';
import { tooltip } from '@/script/editor/id-editor/modules/util/tooltip';
import { actionChangeTags } from '@/script/editor/id-editor/modules/actions';
import { modeBrowse } from '@/script/editor/id-editor/modules/modes';
import { svgIcon } from '@/script/editor/id-editor/modules/svg';
import { uiPresetIcon } from '@/script/editor/id-editor/modules/ui/preset_icon';
import { uiRawMemberEditor } from '@/script/editor/id-editor/modules/ui/raw_member_editor';
import { uiRawMembershipEditor } from '@/script/editor/id-editor/modules/ui/raw_membership_editor';
import { uiRawTagEditor } from '@/script/editor/id-editor/modules/ui/raw_tag_editor';
import { uiTagReference } from '@/script/editor/id-editor/modules/ui/tag_reference';
import { uiPresetEditor } from '@/script/editor/id-editor/modules/ui/preset_editor';
import { utilRebind } from '@/script/editor/id-editor/modules/util';


import { osmEntity, osmRelation } from '@/script/editor/id-editor/modules/osm';
import {
  actionAddEntity,
  actionAddMember,
  actionChangeMember,
  actionDeleteMember,
  actionChangePreset,
} from '@/script/editor/id-editor/modules/actions';
import { modeSelect } from '@/script/editor/id-editor/modules/modes';




/**
 * 创建关系对象
 */

var context;

var relation;

const createRelation = (_,member)=>{
  context = _;
  if(!context) context = getEditor().idContext;
  relation = osmRelation();

  context.perform(
      actionAddEntity(relation),
      actionAddMember(relation.id, {}),
      t('operations.add.annotation.relation')
  );

  return relation

}

const choose = (r)=>{
  relation = r;
  return
}

const setRole=(member,id,callback)=>{
  if(!context) context = getEditor().idContext;
  let relation = context.entity(id);
  
  let _m = relation.members.findIndex(m=>m.id==member.id);
  if(_m>=0){
    context.perform(
        actionChangeMember(id, member,_m),
        t('operations.change_role.annotation')
    );
  }else{
    context.perform(
        actionAddMember(id, member),
        t('operations.add_member.annotation')
    );
    let presets = context.presets();
    let currentPreset = presets.item('relation');
    let preset = presets.item("type/multipolygon")
    changePreset(id,currentPreset,preset);
  }
  
  highLightEntity([id]);
  callback(context.entity(id));
}

const deleteRole = (id,index,callback)=>{
  if(!context) context = getEditor().idContext;
  context.perform(
    actionDeleteMember(id, index),
    t('operations.delete_member.annotation')
  );
  if(callback){
    callback()
  }
}

const changePreset=(id,currentPreset,preset)=>{
  if(!context) context = getEditor().idContext;
  context.perform(
    actionChangePreset(id,currentPreset,preset),
    t('operations.change_tags.annotation')
  )
}

/**
 * 高亮
 * @param {*} arr 
 */
const highLightEntity = (arr)=>{
  console.log(context,777788);
  context.enter(modeSelect(context, arr));
};

/**
 * 定位并高亮
 * @param {} context 
 * @param {*} id 
 */
const positionEntity = (context,id)=>{
  if(!context) context = getEditor().idContext;
  let entity = context.graph().hasEntity(id)
  context.map().zoomTo(entity)
  context.enter(modeSelect(context,[id]));
}


// export {
//   createRelation,
//   choose,
//   setRole,
//   changePreset,
//   highLightEntity,
//   positionEntity,
//   deleteRole
// }

export class RelationOperate {
  constructor(context){
    this.context = context;
    this.currentRelation;
  }
  createRelation(){
    this.currentRelation = osmRelation();
    this.context.perform(
        actionAddEntity(this.currentRelation),
        actionAddMember(this.currentRelation.id, {}),
        t('operations.add.annotation.relation')
    );
    return this.currentRelation
  }
  choose(r){
    this.currentRelation = r
    return this.currentRelation;
  }
  setRole(member,id,callback){
    let relation = this.context.entity(id);
  
    let _m = relation.members.findIndex(m=>m.id==member.id);
    if(_m>=0){
      this.context.perform(
          actionChangeMember(id, member,_m),
          t('operations.change_role.annotation')
      );
    }else{
      this.context.perform(
          actionAddMember(id, member),
          t('operations.add_member.annotation')
      );
      let presets = this.context.presets();
      let currentPreset = presets.item('relation');
      let preset = presets.item("type/multipolygon")
      this.changePreset(id,currentPreset,preset);
    }
    
    this.highLightEntity([id]);
    if(callback){
      callback(this.context.entity(id));
    }
  }
  changePreset(id,currentPreset,preset){
    this.context.perform(
      actionChangePreset(id,currentPreset,preset),
      t('operations.change_tags.annotation')
    )
  }
  deleteRole(id,index,callback){
    context.perform(
      actionDeleteMember(id, index),
      t('operations.delete_member.annotation')
    );
    if(callback){
      callback()
    }
  }
  highLightEntity(arr){
    this.context.enter(modeSelect(this.context, arr));
  }
  positionEntity(context,id){
    let entity = this.context.graph().hasEntity(id)
    this.context.map().zoomTo(entity)
    this.context.enter(modeSelect(this.context,[id]));
  }
}
