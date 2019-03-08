


import {getEditor} from '@/script/operate';

import _clone from 'lodash-es/clone';
import _forEach from 'lodash-es/forEach';
import _isEmpty from 'lodash-es/isEmpty';
import _isEqual from 'lodash-es/isEqual';
import _some from 'lodash-es/some';


import { t, textDirection } from '@/script/editor/id-editor/modules/util/locale';



import { osmEntity, osmRelation } from '@/script/editor/id-editor/modules/osm';
import {
  actionAddEntity,
  actionAddMember,
  actionChangeMember,
  actionDeleteMember,
  actionChangePreset,
} from '@/script/editor/id-editor/modules/actions';
import { modeSelect } from '@/script/editor/id-editor/modules/modes';

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
    this.context.perform(
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
    if(id){
      let entity = this.context.graph().hasEntity(id)
      this.context.map().zoomTo(entity)
      this.context.enter(modeSelect(this.context,[id]));
    }else{
      this.context.enter(modeSelect(this.context,[]));
    }
  }
}
